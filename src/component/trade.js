import React, { } from 'react';
import { Modal, WhiteSpace, WingBlank, Flex, Slider, Tabs, NavBar, Icon } from "antd-mobile";
import 'semantic-ui-css/semantic.min.css';
import BigNumber from "bignumber.js";
import { Scrollbars } from 'react-custom-scrollbars-2';

import trade_buy from '../icon/trade_buy.png';
import trade_price_add from '../icon/trade_price_add.png'
import trade_price_reduce from '../icon/trade_price_reduce.png'

import mAbi from './abi'
import { showPrice, showValueP, showValue, hashKey, formatDate, showToken } from "./common";
import language from './language';
import Base from './base.js';

class Trade extends Base {
    constructor(props) {
        super(props, { interval: 10 });

        let token = localStorage.getItem("TOKEN");
        let baseToken = localStorage.getItem("BASETOKEN");
        if (!token || !baseToken) {
            token = "SERO";
            baseToken = "TUSDT";
        }

        let key = hashKey(token, baseToken);
        this.state = {
            selectedTab: "trade",
            pair: [token, baseToken],
            key: key,
            opType: true,
            balances: {},
            pairInfo: {
                buyList: [],
                sellList: [],
                offline: false,
                lastPrice: 0.000,
                lastOp: "0",
                amountOfIncrease: 0
            },
            lastPrice: 0,
            lastOp: 0,
            amountOfIncrease: 0,
            orders: [],
            showAll: false
        }
    }

    filterList(list, sortType) {
        let arr = [];
        list.filter(function (item, index, list) {
            return item.status === "0";
        }).sort(function (a, b) {
            if (sortType) {
                return Number(b.price) - Number(a.price);
            } else {
                return Number(a.price) - Number(b.price);
            }
        }).forEach(function (item, index) {
            let value = Number(item.value) - Number(item.dealValue);
            let price = item.price;

            if (arr.length === 0 || price !== arr[arr.length - 1].price) {
                arr.push({ price: price, value: value });
            } else {
                arr[arr.length - 1].value += value;
            }
        });
        return arr;
    }

    componentDidUpdate() {
        this.sellItemsRef.scrollToBottom();
        this.buyItemsRef.scrollToTop();
    }

    _init() {

        let self = this;
        let account = this.state.account;
        mAbi.balanceOf(account.mainPKr, self.state.pair, function (maps) {
            self.setState({ balances: maps });
        });

        let oneToken = new BigNumber(10).pow(mAbi.getDecimal(self.state.pair[0]));
        let oneBaseToken = new BigNumber(10).pow(mAbi.getDecimal(self.state.pair[1]));
        mAbi.pairInfo(account.mainPKr, self.state.key, function (info) {
            info.sellList.forEach(each => {
                each.price = new BigNumber(each.price).multipliedBy(oneToken).dividedBy(oneBaseToken).toNumber();
            });

            info.buyList.forEach(each => {
                each.price = new BigNumber(each.price).multipliedBy(oneToken).dividedBy(oneBaseToken).toNumber();
            });

            info.deals.forEach(each => {
                each.price = new BigNumber(each.price).multipliedBy(oneToken).dividedBy(oneBaseToken).toNumber();
            });

            info.deals = info.deals.sort(function (a, b) {
                return Number(a.timestamp) - Number(b.timestamp);
            });
            info.lastPrice = 0.00;
            info.lastOp = 0;
            info.amountOfIncrease = 0;
            if (info.deals.length > 0) {
                info.lastPrice = info.deals[info.deals.length - 1].price;
                info.lastOp = info.deals[info.deals.length - 1].opType;
                info.amountOfIncrease = (info.lastPrice - info.deals[0].price) / info.deals[0].price * 100;
            }
            self.setState({ pairInfo: info });
        });

        mAbi.orders(account.mainPKr, this.state.key, function (orders) {
            orders.forEach(each => {
                each.price = new BigNumber(each.price).multipliedBy(oneToken).dividedBy(oneBaseToken).toNumber();
            });
            self.setState({ orders: orders });
        })
    }

    click(val) {
        let self = this;
        self.setState({ opType: val });
    }

    submit() {
        if (this.state.pairInfo.offline) {
            return;
        }

        let self = this;
        let tokenD = mAbi.getDecimal(this.state.pair[0]);
        let baseTokenD = mAbi.getDecimal(this.state.pair[1]);

        let oneToken = new BigNumber(10).pow(tokenD);
        let oneBaseToken = new BigNumber(10).pow(baseTokenD);
        let price = new BigNumber(this.priceValue.value).multipliedBy(oneBaseToken).dividedBy(oneToken);
        let value = new BigNumber(this.numValue.value).multipliedBy(oneToken);
        if (price.isZero() || value.isZero()) {
            return;
        }

        if (this.state.opType) {
            let amount = price.multipliedBy(value);
            if (amount.toNumber() > this.balanceOf(this.state.pair[1]).toNumber()) {
                Modal.alert('', '余额不足，请充值', [
                    { text: 'OK', onPress: () => console.log('ok') },
                ])
                return;
            }

            let availAmount = new BigNumber(this.state.balances[this.state.pair[1]][0]);
            let payAmount = new BigNumber(0);
            if (availAmount.lt(amount)) {
                payAmount = amount.minus(availAmount);
            }

            price = price.multipliedBy(new BigNumber(10).pow(18));
            mAbi.buy(this.state.account.pk, this.state.account.mainPKr, this.state.key, price.toNumber(), value.toFixed(0), this.state.pair[1], payAmount, function (hash) {
                self.checkTxReceipt(hash);
            });
        } else {
            if (Number(this.numValue.value) > Number(this.balanceOf(this.state.pair[0]))) {
                Modal.alert('', '余额不足，请充值', [
                    { text: 'OK', onPress: () => console.log('ok') },
                ])
                return;
            }

            let availAmount = new BigNumber(this.state.balances[this.state.pair[0]][0]);
            let payAmount = new BigNumber(0);
            if (availAmount.lt(value)) {
                payAmount = value.minus(availAmount);
            }

            price = price.multipliedBy(new BigNumber(10).pow(18));
            mAbi.sell(this.state.account.pk, this.state.account.mainPKr, this.state.key, price.toNumber(), value.toFixed(0), this.state.pair[0], payAmount, function (hash) {
                self.checkTxReceipt(hash);
            });
        }
    }

    updatePrice(step) {
        if (Number(this.priceValue.value) === 0 && step < 0) {
            return;
        }
        this.priceValue.value = (Number(this.priceValue.value) + step).toFixed(3);
    }


    balanceOf(token) {

        let amount = new BigNumber(0);
        if (this.state.balances[token]) {
            amount = amount.plus(this.state.balances[token][0]);
        }
        if (this.state.account && this.state.account.balances.get(token)) {
            amount = amount.plus(new BigNumber(this.state.account.balances.get(token)));
        }
        return amount;
    }

    cancel(orderIds) {
        let self = this;
        mAbi.cancel(this.state.account.pk, this.state.account.mainPKr, this.state.key, orderIds, function (hash) {
            self.checkTxReceipt(hash);
        });
    }

    _render() {
        let self = this;
        let decmails = mAbi.getDecimal(self.state.pair[0]);
        let buyOrderItems = self.filterList(this.state.pairInfo.buyList, true).map((item, index) => {
            return (<Flex key={index}>
                <Flex.Item style={{ textAlign: 'left' }}>{showPrice(item.price, 18)}</Flex.Item>
                <Flex.Item
                    style={{ textAlign: 'right' }}>{showValueP((item.value), decmails, 5)}</Flex.Item>
            </Flex>);
        });

        let sellOrderItems = self.filterList(this.state.pairInfo.sellList, true).map((item, index) => {
            return (<Flex key={index}>
                <Flex.Item style={{ textAlign: 'left' }}>{showPrice(item.price, 18)}</Flex.Item>
                <Flex.Item
                    style={{ textAlign: 'right' }}>{showValueP((item.value), decmails, 5)}</Flex.Item>
            </Flex>);
        });

        let orderIds = [];
        let myOrders = this.state.orders.map((item, index) => {
            if (!self.state.showAll && item.status !== '0') {
                return "";
            }
            orderIds.push(item.id);
            return <div key={index} className="item" style={{ paddingTop: '15px' }}>
                <div className="content">
                    <div className="header">
                        <Flex>
                            <Flex.Item style={{ flex: 3 }}>
                                {
                                    item.type === '1' ?
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
                                }}>{showToken(this.state.pair[0])}/{self.state.pair[1]}</span>
                                <span style={{
                                    fontSize: '15px',
                                    paddingLeft: '5px'
                                }}>{formatDate(new Date(item.createTime * 1000))}</span>
                            </Flex.Item>
                            <Flex.Item style={{ flex: 1, textAlign: 'right' }}>
                                {
                                    item.status === '0' &&
                                    <a href onClick={self.cancel.bind(this, [item.id])}>{language.e().trade.cancel}</a>
                                }
                                {
                                    item.status === '1' &&
                                    <a href style={{ color: '#A8A8A8' }}>{language.e().trade.volume}</a>
                                }
                                {
                                    item.status === '2' &&
                                    <a href style={{ color: '#A8A8A8' }}>{language.e().trade.canceled}</a>
                                }
                            </Flex.Item>
                        </Flex>


                    </div>
                    <div className='extra' style={{ paddingTop: '8px' }}>
                        <div style={{ width: '100%' }}>
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
                                    }}>{language.e().trade.total}({this.state.pair[0]})
                                    </div>
                                    <div>{showValue(item.value, decmails, 3)}</div>
                                </Flex.Item>
                                <Flex.Item style={{ textAlign: 'right' }}>
                                    <div style={{
                                        color: '#A8A8A8',
                                        fontSize: '13px',
                                    }}>{language.e().trade.volume}({this.state.pair[0]})
                                    </div>
                                    <div>{showValue(item.dealValue, decmails, 3)}</div>
                                </Flex.Item>
                            </Flex>
                        </div>
                    </div>
                </div>
            </div>
        });

        return (
            <div>
                <WingBlank>
                    <Flex>
                        <Flex.Item style={{ flex: 67, height: "310px" }}>
                            <Flex>
                                <div className="ui breadcrumb">
                                    <div className="active section"><img alt="" src={trade_buy}
                                        className="ui avatar image" />
                                    </div>
                                    <div className="active section"><span
                                        className="header">{showToken(this.state.pair[0])}/{this.state.pair[1]}</span>
                                    </div>
                                </div>
                            </Flex>

                            <Flex>
                                <Flex.Item>
                                    <div>
                                        <button className={this.state.opType ? "ui positive button" : "ui button"}
                                            style={{ width: '100%' }}
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
                                            className={!this.state.opType ? "ui negative button" : "ui button"}
                                            style={{ width: '100%' }}
                                            disabled={this.state.pairInfo.offline}
                                            onClick={() => {
                                                this.click(false);
                                            }}>{language.e().trade.sell}
                                        </button>
                                    </div>
                                </Flex.Item>
                            </Flex>
                            <WhiteSpace size="lg" />
                            <Flex>
                                <Flex.Item>
                                    <div className="ui right labeled input" style={{ width: '100%' }}>
                                        <input type="number" placeholder={language.e().trade.orderPrice}
                                            style={{ width: '70%' }}
                                            ref={el => this.priceValue = el} onChange={(event) => {
                                                let value = event.target.value;
                                                if (value) {
                                                    value = (value.match(/^\d*(\.?\d{0,6})/g)[0]) || null
                                                    this.setState({ currentPrice: value.toString() })
                                                } else {
                                                    this.setState({ currentPrice: "" });
                                                }
                                                this.priceValue.value = value;
                                                this.spanValue.innerHTML = showValue(value * this.numValue.value, 0, 6);
                                            }} />
                                        <div className="ui basic label label" style={{ width: '30%' }}>
                                            <Flex>
                                                <Flex.Item style={{ flex: 44 }}>
                                                    <a href='true' onClick={this.updatePrice.bind(this, 0.001)}>
                                                        <img alt="" src={trade_price_add} className="ui avatar image"
                                                            style={{ width: '10px', height: '10px' }} />
                                                    </a>
                                                </Flex.Item>
                                                <div style={{
                                                    marginTop: '1px',
                                                    width: '1px',
                                                    height: '15px',
                                                    background: 'darkgray'
                                                }}></div>
                                                <Flex.Item style={{ flex: 45, textAlign: 'left' }}>
                                                    <a href='true' style={{ float: 'left' }}
                                                        onClick={this.updatePrice.bind(this, -0.001)}>
                                                        <img alt="" src={trade_price_reduce} className="ui avatar image"
                                                            style={{ width: '10px', height: '2px' }} />
                                                    </a>
                                                </Flex.Item>
                                            </Flex>
                                        </div>
                                    </div>
                                    <div style={{ paddingTop: '5px' }}>
                                        <span></span>
                                    </div>
                                </Flex.Item>
                            </Flex>
                            <WhiteSpace size="lg" />
                            <Flex>
                                <Flex.Item>
                                    <div className="ui right labeled input" style={{ width: '100%' }}>
                                        <input type="number" ref={el => this.numValue = el}
                                            placeholder={language.e().trade.num}
                                            style={{ width: '70%' }}
                                            onChange={(event) => {
                                                let value = event.target.value;
                                                if (value) {
                                                    value = (value.match(/^\d*(\.?\d{0,3})/g)[0]) || null
                                                    this.setState({ value: value.toString() })
                                                } else {
                                                    this.setState({ value: "" });
                                                }
                                                this.numValue.value = value;
                                                this.spanValue.innerHTML = showValue(value * Number(this.priceValue.value), 0, 6);
                                            }} />
                                        <div className="ui basic label label"
                                            style={{ width: '30%' }}>{this.state.pair[0]}</div>
                                    </div>
                                    <div style={{ paddingTop: '5px', fontSize: '12px', color: '#A8A8A8' }}>
                                        {
                                            this.state.opType ?
                                                <span>{language.e().trade.available} {
                                                    showValue(this.balanceOf(this.state.pair[1]),
                                                        mAbi.getDecimal(this.state.pair[1]),
                                                        9)

                                                } {this.state.pair[1]}</span> :
                                                <span>{language.e().trade.available} {
                                                    showValue(this.balanceOf(this.state.pair[0]),
                                                        mAbi.getDecimal(this.state.pair[0]),
                                                        9)
                                                } {this.state.pair[0]}</span>
                                        }
                                    </div>

                                </Flex.Item>

                            </Flex>
                            <Flex>
                                <Flex.Item>
                                    <div style={{ padding: 15 }}>
                                        <Slider
                                            defaultValue={0}
                                            ref={el => this.slider = el}
                                            min={0}
                                            max={100}
                                            marks={{ 0: "0%", 25: "25%", 50: "50%", 75: "75", 100: "100%" }}

                                            onAfterChange={(val) => {
                                                if (val === 0) {
                                                    this.numValue.value = 0;
                                                    this.spanValue.innerHTML = showValue(Number(0) * Number(this.priceValue.value), 0, 6);
                                                    return;
                                                }
                                                let value = 0;
                                                if (this.state.opType) {
                                                    if (!this.priceValue.value) {
                                                        this.slider.value = 0;
                                                        return
                                                    }
                                                    let balance = this.balanceOf(this.state.pair[1]).dividedBy(new BigNumber(10).pow(mAbi.getDecimal(this.state.pair[1])));
                                                    value = new BigNumber(balance * val / 100 / this.priceValue.value).toFixed(3);
                                                } else {
                                                    let balance = this.balanceOf(this.state.pair[0]).dividedBy(new BigNumber(10).pow(mAbi.getDecimal(this.state.pair[1])));
                                                    value = new BigNumber(balance * val / 100).toFixed(3);
                                                }

                                                this.numValue.value = value;
                                                this.spanValue.innerHTML = showValue(Number(value) * Number(this.priceValue.value), 0, 6);
                                            }}
                                        />
                                    </div>
                                </Flex.Item>
                            </Flex>
                            <WhiteSpace size="lg" />
                            <Flex>
                                <Flex.Item>

                                    <div>
                                        {language.e().trade.amount}:<span style={{ padding: '0px 5px' }}
                                            ref={el => this.spanValue = el}>0</span>{this.state.pair[1]}
                                    </div>
                                    <div style={{ paddingTop: '5px' }}>
                                        {

                                            this.state.opType ? <button className="ui positive button"
                                                style={{ width: '100%' }}
                                                disabled={this.state.pairInfo.offline}
                                                onClick={this.submit.bind(this)}>{language.e().trade.buy}</button> :
                                                <button className="ui negative button"
                                                    disabled={this.state.pairInfo.offline}
                                                    style={{ width: '100%' }}
                                                    onClick={this.submit.bind(this)}>{language.e().trade.sell}</button>
                                        }
                                    </div>
                                </Flex.Item>
                            </Flex>
                        </Flex.Item>
                        {/*<Flex.Item style={{flex: 1, height: "310px"}}></Flex.Item>*/}
                        <Flex.Item style={{ flex: 33, height: "310px", paddingLeft: '8px', paddingRight: '2px' }}>
                            <Flex>
                                <Flex.Item
                                    style={{ textAlign: 'left' }}>{language.e().trade.price}</Flex.Item>
                                <Flex.Item style={{ textAlign: 'right' }}>{language.e().trade.num}</Flex.Item>
                            </Flex>
                            <Scrollbars ref={el => this.sellItemsRef = el} style={{ color: '#D01919', fontSize: '13px', height: '33%' }}>
                                <div role="list" className="ui list" style={{ height: '100%', position: 'relative', width: '100%' }}>
                                    {/* <div style={{ position: 'absolute', bottom: '0px', width: '100%' }}>
                                        
                                    </div> */}
                                    {sellOrderItems}
                                </div>
                            </Scrollbars>
                            <WhiteSpace />
                            <Flex style={this.state.pairInfo.lastOp === "0" ? {
                                        color: '#D01919',
                                        fontSize: '13px'
                                    } : {
                                        color: '#21BA45',
                                        fontSize: '13px'
                                    }}>
                                <Flex.Item style={{ textAlign: 'left' }}><span
                                    >{showPrice(this.state.pairInfo.lastPrice, 3)}</span></Flex.Item>
                                <Flex.Item style={{ textAlign: 'right', paddingRight: '3px' }}><span>
                                    {this.state.pairInfo.amountOfIncrease >= 0 && "+"}
                                    {showValue(this.state.pairInfo.amountOfIncrease, 0, 2)}%</span></Flex.Item>
                            </Flex>
                            <WhiteSpace />
                            <Scrollbars ref={el => this.buyItemsRef = el} style={{ color: '#21BA45', fontSize: '13px', height: '33%' }}>
                                <div role="list" className="ui list">
                                    {buyOrderItems}
                                </div>
                            </Scrollbars>

                        </Flex.Item>
                    </Flex>
                </WingBlank>
                <WhiteSpace size="lg" />
                <WingBlank style={{ paddingTop: '15px', paddingBottom: '100px' }}>
                    <div>
                        <Tabs tabs={[{ title: "当前委托", index: 0 }, { title: "历史委托", index: 1 }]} onChange={(e) => {
                            if (e.index === 1) {
                                self.setState({ showAll: true });
                            } else {
                                self.setState({ showAll: false });
                            }
                        }}>

                        </Tabs>
                        {myOrders}
                        {
                            orderIds.length > 0 && <div className="item" style={{ paddingTop: '15px' }}>
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

                    {/*    <div>*/}
                    {/*        <Depthmap sellList={this.state.pairInfo.sellList} buyList={this.state.pairInfo.buyList}/>*/}
                    {/*    </div>*/}
                    {/*</Tabs>*/}

                </WingBlank>
            </div>
        )
    }
}

export default Trade;

