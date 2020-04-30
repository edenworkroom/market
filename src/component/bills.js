import React, {Component} from 'react';
import mAbi from "./abi";
import {showValue, formatDate, hashKey, showPrice} from "./common";
import {Flex, List, WingBlank} from "antd-mobile";
import pairs from "./pairs";
import MTabbar from "./tabbar";
import language from "./language";


class BillList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pk: localStorage.getItem("PK"),
            token: this.props.match.params.token,
            bills: [],
        }
        console.log("BillList", props);
    }

    componentDidMount() {
        let self = this;
        mAbi.init.then(() => {
            mAbi.accountDetails(localStorage.getItem("PK"), function (account) {
                mAbi.getBills(account.mainPKr, self.state.token, function (bills) {
                    bills.sort(function (a, b) {
                        return b.timestamp - a.timestamp;
                    });
                    self.setState({bills: bills});
                });
            });

            mAbi.initLanguage(function (_lang) {
                language.set(_lang);
            });
        })
    }

    render() {
        let self = this;
        let info = pairs.getInfo(this.state.token);
        let decimals = info.decimals;
        let symbol = info.symbol;
        let bills = this.state.bills.map((item, index) => {
            let opText = language.e().assets.rechange;
            let sign = "+";
            if (item.type == 1) {
                sign = "-";
                opText = language.e().assets.withdrawal;
            } else if (item.type == 2) {
                sign = "+";
                opText = language.e().trade.buy;
            } else if (item.type == 3) {
                sign = "-";
                opText = language.e().trade.sell;
            }
            return <List.Item key={index}>
                <Flex style={{fontSize: '12px'}}>
                    <Flex.Item style={{flex: 18}}>{formatDate(new Date(item.timestamp * 1000))}</Flex.Item>
                    <Flex.Item style={{flex: 5}}>{opText}</Flex.Item>
                    <Flex.Item style={
                        sign === "+" ? {flex: 17,
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
            <div>
                <WingBlank>
                    <List renderHeader={() => '账单'}>
                        {bills}
                    </List>
                </WingBlank>
                <MTabbar selectedTab="asset" pk={this.state.pk}/>
            </div>
        )
    }
}

export default BillList