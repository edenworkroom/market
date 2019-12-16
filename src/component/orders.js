import React, {Component} from 'react';
import mAbi from "./abi";
import {decimals, formatDate, hashKey, showPrice} from "./common";
import {WingBlank} from "antd-mobile";
import pairs from "./pairs";
import MTabbar from "./tabbar";


class OrderList extends Component {
    constructor(props) {
        super(props);
        let token = pairs.SERO.tokens[0];
        let standard = "SERO";
        if (props.match.params.token && props.match.params.standard) {
            token = props.match.params.token;
            standard = props.match.params.standard;
        }
        let key = hashKey(token, standard);
        this.state = {
            pair: [token, standard],
            key: key,
            mainPKr: props.match.params.mainPKr,
            orders: []
        }
    }

    componentDidMount() {
        let self = this;
        mAbi.init.then(() => {
            mAbi.accountList(function (accounts) {
                mAbi.orders(self.state.mainPKr, self.state.key, function (orders) {
                    self.setState({orders: orders});
                })
            });
        })
    }


    render() {
        let self = this;
        let decimal = pairs.getDecimals(this.state.pair[0]);
        let myOrders = this.state.orders.map((item, index) => {
            return <div key={index} className="item" style={{paddingTop: '15px', clear: 'both'}}>
                <div className="content">
                    <div className="header">
                        {
                            item.type === 0 ?
                                <span style={{fontSize: '18px', fontWeight: 'bold', color: '#D01919'}}>卖出</span> :
                                <span style={{fontSize: '18px', fontWeight: 'bold', color: '#21BA45'}}>买入</span>
                        }
                        <span style={{
                            paddingLeft: '3px',
                            fontSize: '18px',
                            fontWeight: 'bold'
                        }}>{self.state.pair[0]}/{self.state.pair[1]}</span>
                        <span style={{
                            fontSize: '15px',
                            paddingLeft: '5px'
                        }}>{formatDate(new Date(item.createTime * 1000))}</span>
                        {
                            item.status == 1 && <a style={{float: 'right', color: '#A8A8A8'}}>已完成</a>
                        }
                        {
                            item.status == 2 && <a style={{float: 'right', color: '#A8A8A8'}}>已撤消</a>
                        }
                    </div>
                    <div className='extra' style={{paddingTop: '8px'}}>
                        <div style={{width: '100%'}}>
                            <div style={{float: 'left', width: '45%'}}>
                                <div style={{color: '#A8A8A8', fontSize: '13px',}}>价格({self.state.pair[1]})</div>
                                <div>{showPrice(item.price,  3)}</div>
                            </div>
                            <div style={{float: 'left'}}>
                                <div style={{color: '#A8A8A8', fontSize: '13px',}}>数量({self.state.pair[0]})</div>
                                <div>{decimals(item.value, decimal, 9)}</div>
                            </div>
                            <div style={{float: 'right', textAlign: 'right'}}>
                                <div style={{color: '#A8A8A8', fontSize: '13px',}}>实际成交({self.state.pair[0]})</div>
                                <div>{decimals(item.dealValue, decimal, 9)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        });

        return (
            <div>
                <WingBlank style={{paddingTop: '15px', clear: 'both'}}>
                    {myOrders}
                </WingBlank>
                <MTabbar selectedTab="trade"/>
            </div>

        )
    }
}

export default OrderList