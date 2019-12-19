import React, {Component} from 'react';
import {Button, List, Modal, WingBlank} from "antd-mobile";
import {createHashHistory} from 'history'

import mAbi from './abi'
import pairs from "./pairs";
import {hashKey, showPK, showPrice} from "./common";

import MTabbar from "./tabbar";
import MCarousel from './carousel'

const operation = Modal.operation;

class Market extends Component {
    constructor(props) {
        super(props);
        this.state = {
            standard: "SERO",
            pairList: [],
            pk: props.match.params.pk,
        }
    }

    initPairList() {
        let self = this;
        const keys = new Array();
        const map = new Map();
        pairs.getTokens(this.state.standard).forEach(function (token) {
            let key = hashKey(token, self.state.standard);
            keys.push(key);
            map[key] = token;
        });

        mAbi.lastPrice("", keys, function (pairMap) {
            const pairList = new Array();
            keys.forEach(key => {
                let lastPrice = 0;
                if (pairMap[key]) {
                    lastPrice = pairMap[key];
                }
                pairList.push({
                    symbol: pairs.getSymbol(map[key]),
                    tokenName: map[key],
                    name: pairs.getName(map[key]),
                    lastPrice: lastPrice,
                    decimals: pairs.getDecimals(map[key])
                })
            });
            self.setState({pairList: pairList});
        });
    }

    componentDidMount() {
        let self = this;
        mAbi.init
            .then(() => {
                if (!self.props.match.params.pk) {
                    mAbi.accountList(function (accounts) {
                        self.setState({pk: accounts[0].pk});
                    });
                }

                self.timer = setInterval(self.initPairList(), 2 * 60 * 1000);
            })
    }

    changAccount() {
        let self = this;
        mAbi.accountList(function (accounts) {
            let actions = [];
            accounts.forEach(function (account, index) {
                actions.push(
                    {
                        text: <span>{account.name + ":" + showPK(account.pk)}</span>, onPress: () => {
                            self.setState({pk: account.pk});
                        }
                    }
                );
            });
            operation(actions);
        });
    }


    render() {
        let self = this;
        const tokenPairs = this.state.pairList.map((item, index) => {
            return (
                <List.Item key={item.tokenName}>
                    <div style={{float: "left", width: "50%"}}>
                        {item.symbol} <span style={{fontSize: '14px'}}>{item.name} </span>
                        <div style={{fontSize: '10px', color: '#A8A8A8'}}>
                            {item.tokenName}
                        </div>
                    </div>
                    <div style={{float: "left", width: "30%"}}>
                        {!item.lastPrice ? 0 : showPrice(item.lastPrice, 3)}
                    </div>
                    <div style={{float: "right", width: "20%", textAlign: "right"}}>
                        <Button type="primary" inline size="small" onClick={() => {
                            createHashHistory().push(`/trade/${this.state.pk}/SERO/${item.tokenName}`);
                        }}>交易</Button>
                    </div>
                </List.Item>
            )
        });

        return (
            <div>
                <div style={{paddingTop: "15px", paddingBottom: '40px'}}>
                    <WingBlank>
                        <MCarousel/>
                    </WingBlank>
                    <WingBlank>
                        <div style={{paddingTop: '15px'}}>
                            <div style={{padding: '0px 15px'}}>
                                <span style={{float: 'left'}}>账号 : {showPK(this.state.pk, 12)}</span>
                            </div>
                            <div style={{float: 'right'}}><a onClick={this.changAccount.bind(this)}>选择账号</a></div>
                        </div>
                        <div style={{clear: 'both'}}></div>
                        <List renderHeader={() => '行情'}>
                            <List.Item>
                                <div style={{float: "left", width: "50%"}}>名称</div>
                                <div style={{float: "left", width: "30%"}}>最新价</div>
                                <div style={{float: "right", width: "20%", textAlign: "right"}}></div>
                            </List.Item>
                            {tokenPairs}
                        </List>
                    </WingBlank>
                </div>

                <MTabbar selectedTab="market" pk={this.state.pk}/>
            </div>)
    }
}

export default Market