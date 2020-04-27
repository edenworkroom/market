import React, {Component} from 'react';
import {Modal, List, Toast, WhiteSpace, WingBlank, Flex, Slider, TabBar, Button, Tabs} from "antd-mobile";
import 'semantic-ui-css/semantic.min.css';
import BigNumber from "bignumber.js";
import {createHashHistory} from 'history'

import trade_buy from '../icon/trade_buy.png';
import trade_price_add from '../icon/trade_price_add.png'
import trade_price_reduce from '../icon/trade_price_reduce.png'

import mAbi from './abi'
import {showPrice, showPK, showValueP, showValue, hashKey, formatDate} from "./common";
import MTabbar from "./tabbar";
import language from './language'
import pairs from "./pairs";
import Depthmap from "./depthmap";

class Trade extends Component {
    constructor(props) {
        super(props);

        let token = localStorage.getItem("TOKEN");
        let standard = localStorage.getItem("STANDARD");

        if (!token || !standard) {
            token = "TTTT";
            standard = "SERO";
        }

        let key = hashKey(token, standard);
        this.state = {
            pair: [token, standard],
            key: key,
            type: true,
            pk: localStorage.getItem("PK"),
            balances: {},
            pairInfo: {
                buyList: [],
                sellList: [],
                lastPrice: 0.000,
                offline: false
            },
            showBuyList: [],
            showSellList: [],
            lastPrice: 0,
            lastOp: 0,
            amountOfIncrease: 0,
            orders: [],
        }
    }

    init(mainPkr) {
        let self = this;
        if (!mainPkr) {
            mainPkr = self.state.mainPKr;
        }

        mAbi.balanceOf(self.state.mainPKr, self.state.pair, function (maps) {
            self.setState({balances: maps});
        });

        mAbi.pairInfo(self.state.mainPKr, self.state.key, function (info) {

            let buyList = new Array();
            info.buyList.filter(function (item, index, list) {
                return item.status == 0;
            }).sort(function (a, b) {
                return b.price - a.price;
            }).forEach(function (item, index) {
                let buyPrice = item.price - item.price % 1
                if (buyList.length == 0 || buyPrice != buyList[buyList.length - 1].price) {
                    buyList.push({price: buyPrice, value: item.value - item.dealValue});
                } else {
                    buyList[buyList.length - 1].value += item.value - item.dealValue;
                }
            });

            let sellList = new Array()
            info.sellList.filter(function (item, index, list) {
                return item.status == 0;
            }).sort(function (a, b) {
                return b.price - a.price;
            }).forEach(function (item, index) {
                let sellPrice = item.price - item.price % 1
                if (sellList.length == 0 || sellPrice != sellList[sellList.length - 1].price) {
                    sellList.push({price: sellPrice, value: item.value - item.dealValue});
                } else {
                    sellList[sellList.length - 1].value += item.value - item.dealValue;
                }
            });

            info.sellList = sellList;
            info.buyList = buyList;

            let volumes = info.volumes.sort(function (a, b) {
                return a.timestamp - b.timestamp;
            });
            info.lastPrice = 0;
            info.lastOp = 0;
            info.amountOfIncrease = 0;
            if (volumes.length > 0) {
                info.lastPrice = volumes[volumes.length - 1].price;
                info.lastOp = volumes[volumes.length - 1].opType;
                info.amountOfIncrease = (info.lastPrice - volumes[0].price) / volumes[0].price * 100;
            }
            console.log("pairInfo", info, info.showSellList);
            self.setState({pairInfo: info, showBuyList: buyList.slice(0, 5), showSellList: sellList.slice(0, 5)});
        });

        mAbi.orders(mainPkr, this.state.key, function (orders) {
            self.setState({orders: orders});
        })
    }

    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    componentDidMount() {
        let self = this;
        mAbi.init.then(() => {
            mAbi.accountDetails(localStorage.getItem("PK"), function (account) {
                self.setState({mainPKr: account.mainPKr})
                self.init(account.mainPKr);

                self.timer = setInterval(function () {
                    self.init(account.mainPKr);
                }, 10 * 1000);

                mAbi.initLanguage(function (_lang) {
                    language.set(_lang);
                });
            });
        })

    }

    click(val) {
        let self = this;
        self.setState({type: val});
    }

    submit() {
        if (this.state.isOffLine) {
            return;
        }
        let price = Number(this.priceValue.value) * 1e18;
        console.log("price", price);
        let value = new BigNumber(this.numValue.value).multipliedBy(new BigNumber(10).pow(pairs.getInfo(this.state.pair[0]).decimals));
        if (price === 0 || value.isZero()) {
            return;
        }

        if (this.state.type) {
            if (Number(this.numValue.value) * price / 1e18 > Number(this.balanceOf(this.state.pair[1]))) {
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
            return showValue(this.state.balances[token][0], pairs.getInfo(token).decimals, 9);
        }
        return 0;
    }

    cancel(orderIds) {
        let self = this;
        mAbi.cancel(this.state.pk, this.state.mainPKr, this.state.key, orderIds);
    }

    render() {
        let self = this;

        let info = pairs.getInfo(this.state.pair[0]);
        let decimals = info.decimals;
        let symbol = info.symbol;

        let buyOrderItems = this.state.showBuyList.map((item, index) => {
            return (
                <Flex key={index}>
                    <Flex.Item style={{textAlign: 'left'}}>{showPrice(item.price, 18)}</Flex.Item>
                    <Flex.Item style={{textAlign: 'right'}}>{showValueP((item.value), decimals, 3)}</Flex.Item>
                </Flex>)
        });

        let sellOrderItems = this.state.showSellList.map((item, index) => {
            return (
                <Flex key={index}>
                    <Flex.Item style={{textAlign: 'left'}}>{showPrice(item.price, 18)}</Flex.Item>
                    <Flex.Item style={{textAlign: 'right'}}>{showValueP((item.value), decimals, 3)}</Flex.Item>
                </Flex>)
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
                        <Flex>
                            <Flex.Item style={{flex: 3}}>
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
                                }}>{symbol}/{self.state.pair[1]}</span>
                                <span style={{
                                    fontSize: '15px',
                                    paddingLeft: '5px'
                                }}>{formatDate(new Date(item.createTime * 1000))}</span>
                            </Flex.Item>
                            <Flex.Item style={{flex: 1, textAlign: 'right'}}>
                                {
                                    item.status == 0 &&
                                    <a
                                        onClick={self.cancel.bind(this, [item.id])}>{language.e().trade.cancel}</a>
                                }
                                {
                                    item.status == 1 &&
                                    <a style={{color: '#A8A8A8'}}>{language.e().trade.volume}</a>
                                }
                                {
                                    item.status == 2 &&
                                    <a style={{color: '#A8A8A8'}}>{language.e().trade.canceled}</a>
                                }
                            </Flex.Item>
                        </Flex>


                    </div>
                    <div className='extra' style={{paddingTop: '8px'}}>
                        <div style={{width: '100%'}}>
                            <Flex>
                                <Flex.Item>
                                    <div style={{
                                        color: '#A8A8A8',
                                        fontSize: '13px',
                                    }}>{language.e().trade.price}({self.state.pair[1]})
                                    </div>
                                    <div>{showPrice(item.price, 18)}</div>
                                </Flex.Item>
                                <Flex.Item>
                                    <div style={{
                                        color: '#A8A8A8',
                                        fontSize: '13px',
                                    }}>{language.e().trade.total}({symbol})
                                    </div>
                                    <div>{showValue(item.value, decimals, 3)}</div>
                                </Flex.Item>
                                <Flex.Item style={{textAlign: 'right'}}>
                                    <div style={{
                                        color: '#A8A8A8',
                                        fontSize: '13px',
                                    }}>{language.e().trade.volume}({symbol})
                                    </div>
                                    <div>{showValue(item.dealValue, decimals, 3)}</div>
                                </Flex.Item>
                            </Flex>
                        </div>
                    </div>
                </div>
            </div>
        });

        return (
            <div style={{minHeight: document.documentElement.clientHeight}}>
                <WingBlank style={{paddingTop: '2px'}}>
                    <div>
                        <Flex>
                            <Flex.Item style={{flex: 67, height: "310px"}}>
                                <Flex>
                                    <div className="ui breadcrumb">
                                        <div className="active section"><img src={trade_buy}
                                                                             className="ui avatar image"/>
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
                                                    disabled={this.state.pairInfo.offline}
                                                    onClick={() => {
                                                        this.click(true);
                                                    }}>{language.e().trade.buy}
                                            </button>
                                        </div>
                                    </Flex.Item>
                                    <Flex.Item>
                                        <div>
                                            <button
                                                className={!this.state.type ? "ui negative button" : "ui button"}
                                                style={{width: '100%'}}
                                                disabled={this.state.pairInfo.offline}
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
                                            <input type="number" placeholder={language.e().trade.orderPrice}
                                                   style={{width: '70%'}}
                                                   ref={el => this.priceValue = el} onChange={(event) => {
                                                let value = event.target.value;
                                                if (value) {
                                                    value = (value.match(/^\d*(\.?\d{0,6})/g)[0]) || null
                                                    this.setState({currentPrice: value.toString()})
                                                } else {
                                                    this.setState({currentPrice: ""});
                                                }
                                                this.priceValue.value = value;
                                                this.spanValue.innerHTML = showValue(value * this.numValue.value, 0, 6);
                                            }}/>
                                            <div className="ui basic label label" style={{width: '30%'}}>
                                                <Flex>
                                                    <Flex.Item style={{flex: 44}}>
                                                        <a onClick={this.updatePrice.bind(this, 0.001)}>
                                                            <img src={trade_price_add} className="ui avatar image"
                                                                 style={{width: '10px', height: '10px'}}/>
                                                        </a>
                                                    </Flex.Item>
                                                    <div style={{
                                                        marginTop: '1px',
                                                        width: '1px',
                                                        height: '15px',
                                                        background: 'darkgray'
                                                    }}></div>
                                                    <Flex.Item style={{flex: 45, textAlign: 'left'}}>
                                                        <a style={{float:'left'}} onClick={this.updatePrice.bind(this, -0.001)}>
                                                            <img src={trade_price_reduce} className="ui avatar image"
                                                                 style={{width: '10px', height: '2px'}}/>
                                                        </a>
                                                    </Flex.Item>
                                                </Flex>
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
                                            <input type="number" ref={el => this.numValue = el}
                                                   placeholder={language.e().trade.num}
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
                                                       this.spanValue.innerHTML = showValue(value * Number(this.priceValue.value), 0, 6);
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
                                <Flex>
                                    <Flex.Item>
                                        <div style={{padding: 15}}>
                                            <Slider
                                                defaultValue={0}
                                                ref={el => this.slider = el}
                                                min={0}
                                                max={100}
                                                marks={{0: "0%", 25: "25%", 50: "50%", 75: "75", 100: "100%"}}

                                                onAfterChange={(val) => {
                                                    if (val == 0) {
                                                        return;
                                                    }
                                                    let value = 0;
                                                    if (this.state.type) {
                                                        if (!this.priceValue.value) {
                                                            this.slider.value = 0;
                                                            return
                                                        }
                                                        let balance = this.balanceOf(this.state.pair[1])
                                                        value = new BigNumber(balance * val / 100 / this.priceValue.value).toFixed(3);
                                                    } else {
                                                        let balance = this.balanceOf(this.state.pair[0]);
                                                        value = new BigNumber(balance * val / 100).toFixed(3);
                                                    }

                                                    this.numValue.value = value;
                                                    this.spanValue.innerHTML = showValue(Number(value) * Number(this.priceValue.value), 0, 6);
                                                }}
                                            />
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
                                                                          disabled={this.state.pairInfo.offline}
                                                                          onClick={this.submit.bind(this)}>{language.e().trade.buy}</button> :
                                                    <button className="ui negative button"
                                                            disabled={this.state.pairInfo.offline}
                                                            style={{width: '100%'}}
                                                            onClick={this.submit.bind(this)}>{language.e().trade.sell}</button>
                                            }
                                        </div>
                                    </Flex.Item>
                                </Flex>
                            </Flex.Item>
                            {/*<Flex.Item style={{flex: 1, height: "310px"}}></Flex.Item>*/}
                            <Flex.Item style={{flex: 33, height: "310px",paddingLeft:'8px',paddingRight:'8px'}}>
                                <Flex>
                                    <Flex.Item
                                        style={{textAlign: 'left'}}>{language.e().trade.price}</Flex.Item>
                                    <Flex.Item style={{textAlign: 'right'}}>{language.e().trade.num}</Flex.Item>
                                </Flex>
                                <div role="list" className="ui list" style={{color: '#D01919', fontSize: '13px'}}>
                                    {sellOrderItems}
                                </div>
                                <div>
                                    <Flex>
                                        <Flex.Item style={{textAlign: 'left'}}><span
                                            style={this.state.pairInfo.lastOp == 0 ? {color: '#D01919'} : {color: '#21BA45'}}>{showPrice(this.state.pairInfo.lastPrice, 3)}</span></Flex.Item>
                                        <Flex.Item style={{textAlign: 'right'}}><span>
                                        {this.state.pairInfo.amountOfIncrease >= 0 && "+"}
                                            {showValue(this.state.pairInfo.amountOfIncrease, 0, 2)}%</span></Flex.Item>
                                    </Flex>
                                </div>

                                <div role="list" className="ui list" style={{color: '#21BA45'}}>
                                    {buyOrderItems}
                                </div>
                            </Flex.Item>
                        </Flex>
                    </div>
                </WingBlank>
                <WhiteSpace size="lg"/>
                <WingBlank style={{paddingTop: '15px', paddingBottom: '100px', clear: 'both'}}>
                    <div>
                                <span><a onClick={() => {
                                    createHashHistory().push("/orders");
                                }}>{language.e().trade.all}</a></span>
                        {myOrders}
                        {
                            orderIds.length > 0 && <div className="item" style={{paddingTop: '15px'}}>
                                <button className="ui fluid button"
                                        onClick={self.cancel.bind(this, orderIds)}>{language.e().trade.cancelAll}</button>
                            </div>
                        }
                    </div>
                    {/*<Tabs tabs={[{title: language.e().trade.openOrders, sub: '0'}, {*/}
                    {/*    title: language.e().trade.depth,*/}
                    {/*    sub: '1'*/}
                    {/*}]}*/}
                    {/*      initialPage={0}*/}
                    {/*>*/}
                    {/*    */}
                    {/*    <div>*/}
                    {/*        <Depthmap sellList={this.state.pairInfo.sellList} buyList={this.state.pairInfo.buyList}/>*/}
                    {/*    </div>*/}
                    {/*</Tabs>*/}

                </WingBlank>
                <MTabbar selectedTab="trade"/>
            </div>
        )
    }
}

export default Trade;

