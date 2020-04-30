import React, {Component} from 'react';
import mAbi from "./abi";
import {showValue, formatDate, hashKey, showPrice} from "./common";
import {WingBlank} from "antd-mobile";
import MTabbar from "./tabbar";
import language from "./language";


class OrderList extends Component {
    constructor(props) {
        super(props);

        let token = localStorage.getItem("TOKEN");
        let standard = localStorage.getItem("STANDARD");

        if (!token || !standard) {
            token = "THE_FIRST_PRIVACY_COIN";
            standard = "SERO";
        }
        let key = hashKey(token, standard);
        this.state = {
            pair: [token, standard],
            key: key,
            orders: []
        }
    }

    componentDidMount() {
        let self = this;
        mAbi.init.then(() => {
            mAbi.accountDetails(localStorage.getItem("PK"), function (account) {
                mAbi.orders(account.mainPKr, self.state.key, function (orders) {
                    self.setState({orders: orders});
                })
            });
            mAbi.initLanguage(function (_lang) {
                language.set(_lang);
            });
        })
    }


    render() {
        let self = this;
        let decimals = localStorage.getItem("D_" + this.state.pair[0]);
        let myOrders = this.state.orders.map((item, index) => {
            return <div key={index} className="item" style={{
                paddingTop: '15px', clear: 'both',
                paddingBottom: (index === this.state.orders.length - 1) ? "100px" : "0px"
            }}>
                <div className="content">
                    <div className="header">
                        {
                            item.type === 0 ?
                                <span style={{
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    color: '#D01919'
                                }}>{language.e().trade.sell}</span> :
                                <span style={{
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    color: '#21BA45'
                                }}>{language.e().trade.buy}</span>
                        }
                        <span style={{
                            paddingLeft: '3px',
                            fontSize: '18px',
                            fontWeight: 'bold'
                        }}>{this.state.pair[0]}/{self.state.pair[1]}</span>
                        <span style={{
                            fontSize: '15px',
                            paddingLeft: '5px'
                        }}>{formatDate(new Date(item.createTime * 1000))}</span>
                        {
                            item.status == 1 &&
                            <a style={{float: 'right', color: '#A8A8A8'}}>{language.e().trade.finished}</a>
                        }
                        {
                            item.status == 2 &&
                            <a style={{float: 'right', color: '#A8A8A8'}}>{language.e().trade.canceled}</a>
                        }
                    </div>
                    <div className='extra' style={{paddingTop: '8px'}}>
                        <div style={{width: '100%'}}>
                            <div style={{float: 'left', width: '45%'}}>
                                <div style={{
                                    color: '#A8A8A8',
                                    fontSize: '13px',
                                }}>{language.e().trade.price}({self.state.pair[1]})
                                </div>
                                <div>{showPrice(item.price, 3)}</div>
                            </div>
                            <div style={{float: 'left'}}>
                                <div
                                    style={{
                                        color: '#A8A8A8',
                                        fontSize: '13px',
                                    }}>{language.e().trade.total}({this.state.pair[0]})
                                </div>
                                <div>{showValue(item.value, decimals, 3)}</div>
                            </div>
                            <div style={{float: 'right', textAlign: 'right'}}>
                                <div
                                    style={{
                                        color: '#A8A8A8',
                                        fontSize: '13px',
                                    }}>{language.e().trade.volume}({this.state.pair[0]})
                                </div>
                                <div>{showValue(item.dealValue, decimals, 3)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        });

        return (
            <div>
                <WingBlank style={{paddingTop: '15px'}}>
                    {myOrders}
                </WingBlank>
                <MTabbar selectedTab="trade"/>
            </div>

        )
    }
}

export default OrderList