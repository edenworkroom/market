import React, {Component} from 'react';
import {Button, Carousel, Item, List, Modal, TabBar, WingBlank} from "antd-mobile";
import BigNumber from "bignumber.js";

import mAbi from './abi'
import pairs from "./pairs";
import {decimals, hashKey} from "./common";

import MTabbar from "./tabbar";
import MCarousel from './carousel'

const operation = Modal.operation;

class Market extends Component {
    constructor(props) {
        super(props);
        this.state = {
            standard: "SERO",
            pairList: [],
            onPress: props.onPress
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
                pairList.push({
                    symbol: pairs.getSymbol(map[key]),
                    tokenName: map[key],
                    lastPrice: pairMap[key],
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
                <List.Item key={item.tokenName} onClick={() => {
                    console.log("onClick", self.state.onPress);
                    self.state.onPress([item.tokenName, this.state.standard]);
                }}>
                    <div style={{float: "left", width: "40%"}}>{item.symbol}</div>
                    <div style={{
                        float: "left",
                        width: "40%"
                    }}>{!item.lastPrice ? 0 : decimals(item.lastPrice[0].div(item.lastPrice[1], 1, 3))}</div>
                    <div style={{float: "right", width: "20%"}}>
                        <Button type="primary" inline size="small" style={{width: '70px'}}>0</Button>
                    </div>
                </List.Item>
            )
        });

        return (
            <div>
                <div style={{padding: "15px 0px"}}>
                    <WingBlank>
                        <MCarousel/>
                    </WingBlank>
                    <WingBlank>
                        <List renderHeader={() => '行情'}>
                            <List.Item>
                                <div style={{float: "left", width: "40%"}}>名称</div>
                                <div style={{float: "left", width: "40%"}}>最新价</div>
                                <div style={{float: "right", width: "20%", textAlign: "right"}}>跌涨幅</div>
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