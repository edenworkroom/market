import React, {Component} from 'react';
import {Modal, List, WhiteSpace, WingBlank, Flex} from "antd-mobile";
import 'semantic-ui-css/semantic.min.css';
import BigNumber from "bignumber.js";
import {createHashHistory} from 'history'

import trade_buy from '../icon/trade_buy.png';
import trade_price_add from '../icon/trade_price_add.png'
import trade_price_reduce from '../icon/trade_price_reduce.png'

import mAbi from './abi'
import {decimals, showPrice, showPK, hashKey, formatDate} from "./common";
import pairs from "./pairs";
import MTabbar from "./tabbar";
import language from './language'

const operation = Modal.operation;

class Trade extends Component {
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
            type: true,
            pk: props.match.params.pk,
            mainPKr: "",
            balances: {},
            pairInfo: {
                buyList: [],
                sellList: [],
                lastPrice: [],
            },
            orders: [],
        }
    }

    init(mainPkr) {
        let self = this;
        self.setState({balances: {}})
        mAbi.balanceOf(self.state.mainPKr, self.state.pair, function (maps) {
            self.setState({balances: maps});
        });
        mAbi.pairInfo(self.state.mainPKr, self.state.key, 1, function (info) {
            self.setState({pairInfo: info});
        });
        mAbi.orders(mainPkr, this.state.key, function (orders) {
            self.setState({orders: orders});
        })
    }

    componentDidMount() {
        let self = this;
        mAbi.init.then(() => {
            mAbi.accountDetails(this.state.pk, function (account) {
                self.setState({mainPKr: account.mainPKr})
                self.init(account.mainPKr);
                setInterval(function () {
                    self.init(self.state.mainPKr);
                }, 20 * 1000);
            });

            mAbi.initLanguage(function (_lang) {
                language.set(_lang);
            });
        })
    }

    click(val) {
        let self = this;
        self.setState({type: val});
    }

    submit() {
        let price = Number(this.priceValue.value) * 1000;
        let value = new BigNumber(this.numValue.value).multipliedBy(new BigNumber(10).pow(pairs.getDecimals(this.state.pair[0])));
        if (price === 0 || value.isZero()) {
            return;
        }

        if (this.state.type) {
            if (Number(this.numValue.value) * price / 1000 > Number(this.balanceOf(this.state.pair[1]))) {
                Modal.alert('', '余额不足，请充值', [
                    {text: 'OK', onPress: () => console.log('ok')},
                ])
                return;
            }
            mAbi.buy(this.state.pk, this.state.mainPKr, this.state.key, price, value.toFixed(0));
        } else {
            if (Number(this.numValue.value) > Number(this.balanceOf(this.state.pair[0]))) {
                Modal.alert('', '余额不足，请充值', [
                    {text: 'OK', onPress: () => console.log('ok')},
                ])
                return;
            }
            mAbi.sell(this.state.pk, this.state.mainPKr, this.state.key, price, value.toFixed(0));
        }
    }

    updatePrice(step) {
        if (Number(this.priceValue.value) === 0 && step < 0) {
            return;
        }
        this.priceValue.value = (Number(this.priceValue.value) + step).toFixed(3);
    }

    balanceOf(token) {
        if (this.state.balances[token]) {
            let decimal = pairs.getDecimals(token);
            return decimals(this.state.balances[token][0], decimal, 9);
        }
        return 0;
    }

    cancel(orderIds) {
        let self = this;
        mAbi.cancel(this.state.pk, this.state.mainPKr, this.state.key, orderIds);
    }

    render() {
        let self = this;
        let symbol = pairs.getSymbol(this.state.pair[0]);
        let decimal = pairs.getDecimals(this.state.pair[0]);

        let buyOrderItems = this.state.pairInfo.buyList.map((item, index) => {
            return <div key={index} role="listitem" className="item" style={{fontSize: '13px'}}>
                <div style={{float: 'left'}}>{showPrice(item.price, 3)}</div>
                <div style={{float: 'right'}}>{decimals((item.value), decimal, 5)}</div>
            </div>
        });

        let sellOrderItems = this.state.pairInfo.sellList.map((item, index) => {
            return <div key={index} role="listitem" className="item" style={{fontSize: '13px'}}>
                <div style={{float: 'left'}}>{showPrice(item.price, 3)}</div>
                <div style={{float: 'right'}}>{decimals((item.value), decimal, 5)}</div>
            </div>
        });

        let orderIds = [];
        let myOrders = this.state.orders.map((item, index) => {
            if (item.status != 0) {
                return;
            }
            orderIds.push(item.id);
            return <div key={index} className="item" style={{paddingTop: '15px', clear: 'both'}}>
                <div className="content">
                    <div className="header">
                        {
                            item.type === 0 ?
                                <span style={{fontSize: '18px', fontWeight: 'bold', color: '#D01919'}}>{language.e().trade.sell}</span> :
                                <span style={{fontSize: '18px', fontWeight: 'bold', color: '#21BA45'}}>{language.e().trade.buy}</span>
                        }
                        <span style={{
                            paddingLeft: '3px',
                            fontSize: '18px',
                            fontWeight: 'bold'
                        }}>{symbol}/{self.state.pair[1]}</span>
                        <span style={{
                            fontSize: '15px',
                            paddingLeft: '5px'
                        }}>{formatDate(new Date(item.createTime * 1000))}</span>
                        {
                            item.status == 0 &&
                            <a style={{float: 'right'}} onClick={self.cancel.bind(this, [item.id])}>{language.e().trade.cancel}</a>
                        }
                        {
                            item.status == 1 && <a style={{float: 'right', color: '#A8A8A8'}}>{language.e().trade.volume}</a>
                        }
                        {
                            item.status == 2 && <a style={{float: 'right', color: '#A8A8A8'}}>{language.e().trade.canceled}</a>
                        }
                    </div>
                    <div className='extra' style={{paddingTop: '8px'}}>
                        <div style={{width: '100%'}}>
                            <div style={{float: 'left', width: '45%'}}>
                                <div style={{color: '#A8A8A8', fontSize: '13px',}}>{language.e().trade.price}({self.state.pair[1]})</div>
                                <div>{showPrice(item.price, 3)}</div>
                            </div>
                            <div style={{float: 'left'}}>
                                <div style={{color: '#A8A8A8', fontSize: '13px',}}>{language.e().trade.total}({symbol})</div>
                                <div>{decimals(item.value, decimal, 9)}</div>
                            </div>
                            <div style={{float: 'right', textAlign: 'right'}}>
                                <div style={{color: '#A8A8A8', fontSize: '13px',}}>{language.e().trade.volume}({symbol})</div>
                                <div>{decimals(item.dealValue, decimal, 9)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        });
        return (
            <div>
                <WingBlank style={{paddingTop: '2px'}}>
                    <div>
                        <div style={{float: 'left', width: '65%'}}>
                            <Flex>
                                <div className="ui breadcrumb">
                                    <div className="active section"><img src={trade_buy} className="ui avatar image"/>
                                    </div>
                                    <div className="active section"><span
                                        className="header">{symbol}/{this.state.pair[1]}</span>
                                    </div>
                                </div>
                            </Flex>

                            <Flex>
                                <Flex.Item>
                                    <div>
                                        <button className={this.state.type ? "ui positive button" : "ui button"}
                                                style={{width: '100%'}}
                                                onClick={() => {
                                                    this.click(true);
                                                }}>{language.e().trade.buy}
                                        </button>
                                    </div>
                                </Flex.Item>
                                <Flex.Item>
                                    <div>
                                        <button className={!this.state.type ? "ui negative button" : "ui button"}
                                                style={{width: '100%'}}
                                                onClick={() => {
                                                    this.click(false);
                                                }}>{language.e().trade.sell}
                                        </button>
                                    </div>
                                </Flex.Item>
                            </Flex>
                            <WhiteSpace size="lg"/>
                            <Flex>
                                <Flex.Item>
                                    <div className="ui right labeled input" style={{width: '100%'}}>
                                        <input type="number" placeholder={language.e().trade.orderPrice} style={{width: '70%'}}
                                               ref={el => this.priceValue = el}  onChange={(event) => {
                                            let value = event.target.value;
                                            if (value) {
                                                value = (value.match(/^\d*(\.?\d{0,3})/g)[0]) || null
                                                this.setState({currentPrice: value.toString()})
                                            } else {
                                                this.setState({currentPrice: ""});
                                            }
                                            this.priceValue.value = value;
                                            this.spanValue.innerHTML = new BigNumber(value * this.numValue.value).toFixed(3);
                                        }}/>
                                        <div className="ui basic label label" style={{width: '30%'}}>
                                            <div style={{float: 'left', width: '45%'}}>
                                                <a onClick={this.updatePrice.bind(this, 0.001)}>
                                                    <img src={trade_price_add} className="ui avatar image"
                                                         style={{width: '10px', height: '10px'}}/>
                                                </a>
                                            </div>
                                            <div style={{
                                                float: 'left',
                                                marginTop: '1px',
                                                width: '1px',
                                                height: '15px',
                                                background: 'darkgray'
                                            }}></div>
                                            <div style={{float: 'left', paddingLeft: '10px', width: '45%'}}>
                                                <a onClick={this.updatePrice.bind(this, -0.001)}>
                                                    <img src={trade_price_reduce} className="ui avatar image"
                                                         style={{width: '10px', height: '2px'}}/>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{paddingTop: '5px'}}>
                                        <span></span>
                                    </div>
                                </Flex.Item>
                            </Flex>
                            <WhiteSpace size="lg"/>
                            <Flex>
                                <Flex.Item>
                                    <div className="ui right labeled input" style={{width: '100%'}}>
                                        <input type="number" ref={el => this.numValue = el} placeholder={language.e().trade.num}
                                               style={{width: '70%'}}
                                               onChange={(event) => {
                                                   let value = event.target.value;
                                                   if (value) {
                                                       value = (value.match(/^\d*(\.?\d{0,3})/g)[0]) || null
                                                       this.setState({value: value.toString()})
                                                   } else {
                                                       this.setState({value: ""});
                                                   }
                                                   this.numValue.value = value;
                                                   this.spanValue.innerHTML = new BigNumber(value * Number(this.priceValue.value)).toFixed(3);
                                               }}/>
                                        <div className="ui basic label label"
                                             style={{width: '30%'}}>{symbol}</div>
                                    </div>
                                    <div style={{paddingTop: '5px', fontSize: '12px', color: '#A8A8A8'}}>
                                        {
                                            this.state.type ?
                                                <span>{language.e().trade.available} {this.balanceOf(this.state.pair[1])} {this.state.pair[1]}</span> :
                                                <span>{language.e().trade.available} {this.balanceOf(this.state.pair[0])} {symbol}</span>
                                        }
                                    </div>
                                </Flex.Item>
                            </Flex>
                            <WhiteSpace size="lg"/>
                            <Flex>
                                <Flex.Item>
                                    <div>
                                        {language.e().trade.amount}:<span style={{padding: '0px 5px'}}
                                                  ref={el => this.spanValue = el}>0</span>{this.state.pair[1]}
                                    </div>
                                    <div style={{paddingTop: '5px'}}>
                                        {

                                            this.state.type ? <button className="ui positive button"
                                                                      style={{width: '100%'}}
                                                                      onClick={this.submit.bind(this)}>{language.e().trade.buy}</button> :
                                                <button className="ui negative button"
                                                        style={{width: '100%'}}
                                                        onClick={this.submit.bind(this)}>{language.e().trade.sell}</button>
                                        }
                                    </div>
                                </Flex.Item>
                            </Flex>
                        </div>
                        <div style={{float: 'right', width: '30%', paddingTop: '8px'}}>
                            <div role="list" className="ui list">
                                <div role="listitem" className="item">
                                    <div style={{float: 'left'}}>{language.e().trade.price}</div>
                                    <div style={{float: 'right'}}>{language.e().trade.num}</div>
                                </div>
                            </div>
                            <div role="list" className="ui list" style={{color: '#D01919'}}>
                                {sellOrderItems}
                            </div>
                            <div>
                                <span>{showPrice(this.state.pairInfo.lastPrice, 3)}</span>
                            </div>

                            <div role="list" className="ui list" style={{color: '#21BA45'}}>
                                {buyOrderItems}
                            </div>
                        </div>
                    </div>
                </WingBlank>
                <WhiteSpace size="lg"/>
                <WingBlank style={{paddingTop: '15px', paddingBottom: '100px', clear: 'both'}}>
                    <div>
                        <div>
                            <span style={{float: 'left', fontSize: '17px'}}>{language.e().trade.openOrders}</span>
                        </div>
                        <div style={{float: 'right'}}><a onClick={() => {
                            createHashHistory().push(`/orders/${self.state.pair[1]}/${self.state.pair[0]}/${this.state.pk}/${self.state.mainPKr}`);
                        }}>{language.e().trade.all}</a></div>
                    </div>
                    <div className="ui divider" style={{clear: 'both', marginTop: '30px'}}></div>
                    {myOrders}
                    {
                        orderIds.length > 0 && <div className="item" style={{paddingTop: '15px', clear: 'both'}}>
                            <button className="ui fluid button" onClick={self.cancel.bind(this, orderIds)}>{language.e().trade.cancelAll}</button>
                        </div>
                    }

                </WingBlank>
                <MTabbar selectedTab="trade" pk={this.state.pk}/>
            </div>
        )
    }

}

export default Trade;

