import React, { Component } from 'react';
import mAbi from "./abi";
import { showValue, formatDate, hashKey, showPrice } from "./common";
import { Flex, List, WingBlank } from "antd-mobile";
import MTabbar from "./tabbar";
import language from "./language";

import Base from './base.js';


class BillList extends Base {
    constructor(props) {
        super(props);

        this.state = {
            token: props.match.params.token,
            bills: [],
        }
    }

    _init() {
        let self = this;
        mAbi.getBills(this.state.account.mainPKr, this.state.token, function (bills) {
            bills.sort(function (a, b) {
                let t1 = parseInt(a.timestamp);
                let t2 = parseInt(b.timestamp)
                if (t1 === t2) {
                    return -1;
                } else {
                    return t2 - t1;
                }
            });
            self.setState({ bills: bills });
        });
    }

    _render() {
        let self = this;
        //enum BillType {recharge, withdraw, buy, sell, fee, dealBuy, dealSell}
        let decimals = localStorage.getItem("D_" + this.state.token);
        let bills = this.state.bills.map((item, index) => {
            let opText = language.e().assets.rechange;
            let sign = "+";
            if (item.bType === "1") {
                sign = "-";
                opText = language.e().assets.withdrawal;
            } else if (item.bType === "2") {
                sign = "+";
                opText = language.e().trade.buy;
            } else if (item.bType === "3") {
                sign = "-";
                opText = language.e().trade.sell;
            } else if (item.bType === "4") {
                sign = "+";
                opText = language.e().trade.fee;
            } else if (item.bType === "5") {
                sign = "-";
                opText = language.e().trade.dealBuy;
            } else if (item.bType === "6") {
                sign = "+";
                opText = language.e().trade.dealSell;
            }
            return <List.Item key={index}>
                <Flex style={{ fontSize: '12px' }}>
                    <Flex.Item style={{ flex: 18 }}>{formatDate(new Date(item.timestamp * 1000))}</Flex.Item>
                    <Flex.Item style={{ flex: 5 }}>{opText}</Flex.Item>
                    <Flex.Item style={
                        sign === "+" ? {
                            flex: 17,
                            textAlign: 'right',
                            paddingRight: '2px',
                            color: '#D01919'
                        } : {
                            flex: 17,
                            textAlign: 'right',
                            paddingRight: '2px',
                            color: '#21BA45'
                        }}>{sign}{showValue(item.value, decimals, 2)} {this.state.token}</Flex.Item>
                </Flex>
            </List.Item>
        });

        return (
            <WingBlank>
                <List renderHeader={() => '账单'}>
                    {bills}
                </List>
            </WingBlank>
        )
    }
}

export default BillList