import React, {Component} from 'react';
import {Button, List, WingBlank} from "antd-mobile";
import {createHashHistory} from 'history'

import mAbi from './abi'
import pairs from "./pairs";
import {hashKey, showPrice} from "./common";

import MTabbar from "./tabbar";
import MCarousel from './carousel'


class Market extends Component {
    constructor(props) {
        super(props);
        this.state = {
            standard: "SERO",
            pairList: [],
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
                self.timer = setInterval(self.initPairList(), 20 * 1000);
            })
    }


    render() {
        let self = this;
        const tokenPairs = this.state.pairList.map((item, index) => {
            return (
                <List.Item key={item.tokenName}>
                    <div style={{float: "left", width: "40%"}}>
                        {item.symbol} <span style={{fontSize: '14px'}}>{item.name} </span>
                        <div style={{fontSize: '10px', color: '#A8A8A8'}}>
                            {item.tokenName}
                        </div>
                    </div>
                    <div style={{float: "left", width: "40%"}}>
                        {!item.lastPrice ? 0 : showPrice(item.lastPrice, 3)}
                    </div>
                    <div style={{float: "right", width: "20%"}}>
                        <Button type="primary" inline size="small" style={{width: '70px'}} onClick={() => {
                            createHashHistory().push("/trade/SERO/" + item.tokenName);
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
                        <List renderHeader={() => '行情'}>
                            <List.Item>
                                <div style={{float: "left", width: "40%"}}>名称</div>
                                <div style={{float: "left", width: "40%"}}>最新价</div>
                                <div style={{float: "right", width: "20%", textAlign: "right"}}></div>
                            </List.Item>
                            {tokenPairs}
                        </List>
                    </WingBlank>
                </div>

                <MTabbar selectedTab="market"/>
            </div>)
    }
}

export default Market