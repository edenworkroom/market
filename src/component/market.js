import React, {Component} from 'react';
import {Button, Carousel, Item, List, Modal, TabBar, WingBlank} from "antd-mobile";
import BigNumber from "bignumber.js";
import {createHashHistory} from 'history'

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
            console.log("keys", keys);
            keys.forEach(key => {
                let lastPrice = [0, 1];
                if (pairMap[key] && pairMap[key].length == 2) {
                    lastPrice = pairMap[key];
                }
                pairList.push({
                    symbol: pairs.getSymbol(map[key]),
                    tokenName: map[key],
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
                    <div style={{float: "left", width: "40%"}}>{item.symbol}</div>
                    <div style={{float: "left", width: "40%"}}>
                        {!item.lastPrice ? 0 : decimals(item.lastPrice[0] / (item.lastPrice[1]), 0, 3)}
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
                <div style={{padding: "15px 0px"}}>
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