import React, { } from 'react';
import { Button, List, Card, WingBlank, WhiteSpace, Tabs, Flex, Icon, Modal, Toast } from "antd-mobile";
import { createHashHistory } from 'history'
import 'semantic-ui-css/semantic.min.css';

import mAbi from './abi'
import { showValue, showPrice, showToken } from "./common";

import language from './language'
import Base from './base.js';

const operation = Modal.operation;

class Market extends Base {
    constructor(props) {
        super(props);

        this.state = {
            selectedTab: "market",
            pairList: [],
            tabs: [],
            baseToken: "",
        }
    }

    _init(_baseToken) {
        let self = this;
        mAbi.baseTokens(self.state.account.mainPKr, function (tokens) {
            let tabs = [];
            tokens.forEach((each, index) => {
                tabs.push({ title: each, sub: index + 1 });
            });

            let baseToken = self.state.baseToken;
            if (baseToken) {
                baseToken = _baseToken;
            }

            if (!baseToken) {
                baseToken = tokens[0];
            }

            mAbi.pairList(self.state.account.mainPKr, baseToken, function (tokens) {

                const pairList = [];
                tokens.forEach(each => {
                    let firstPrice = parseInt(each.firstPrice);
                    let lastPrice = parseInt(each.lastPrice);
                    let amountOfIncrease = 0;
                    if (firstPrice !== 0) {
                        amountOfIncrease = (lastPrice - firstPrice) / firstPrice * 100;
                    }

                    pairList.push({
                        token: each.token,
                        baseToken: baseToken,
                        lastPrice: each.lastPrice,
                        volume: each.volume,
                        decimals: each.decimals,
                        amountOfIncrease: amountOfIncrease,
                        offline: each.offline
                    });
                });
                pairList.sort(function (a, b) {
                    return b.volume - a.volume;
                });

                self.setState({ baseToken: baseToken, tabs: tabs, pairList: pairList });
            });
        });
    }

    _render() {
        let self = this;
        const tokenPairs = this.state.pairList.map((item, index) => {
            return (
                <List.Item key={item.token}>
                    <Flex>
                        <Flex.Item style={{ flex: 45 }}>
                            <span style={{ fontSize: '14px' }}>{showToken(item.token)} </span>
                            <div style={{ fontSize: '10px', color: '#A8A8A8' }}>
                                {item.token}
                            </div>
                        </Flex.Item>
                        <Flex.Item style={{ flex: 28 }}>
                            {!item.lastPrice ? 0 : showPrice(item.lastPrice, 3)}
                            <div style={{ fontSize: '10px', color: '#A8A8A8' }}>
                                {showValue(item.volume, item.decimals, 6)}{item.standard}
                            </div>
                        </Flex.Item>
                        <Flex.Item style={{ flex: 27, textAlign: "right" }}>
                            <Button inline size="small" style={item.amountOfIncrease < 0 ? {
                                backgroundColor: '#D01919',
                                color: 'white'
                            } : { backgroundColor: '#21BA45', color: 'white' }} onClick={() => {
                                localStorage.setItem("TOKEN", item.token);
                                localStorage.setItem("BASETOKEN", item.baseToken);
                                createHashHistory().push("/trade");
                            }}><span>
                                    {item.amountOfIncrease >= 0 && "+"}
                                    {showValue(item.amountOfIncrease, 0, 2)}%</span>
                            </Button>
                        </Flex.Item>
                    </Flex>
                    {/* {
                        this.state.mainPKr === onwer &&
                        <div>
                            <Button inline type="primary" size="small" onClick={() => {
                                let key = hashKey(item.tokenName, item.standard);
                                if (item.offline === 1) {
                                    mAbi.on(this.state.pk, this.state.mainPKr, key)
                                } else {
                                    mAbi.off(this.state.pk, this.state.mainPKr, key)
                                }
                            }}><span>{item.offline === 1 ? "上线" : "下线"}</span>
                            </Button>
                        </div>
                    } */}
                </List.Item>
            )
        });

        return (
            <WingBlank>
                <Card>
                    <Card.Header
                        title="自助上币"
                        extra={<Button inline size="small"
                            onClick={() => {
                                mAbi.addPair(this.state.account.pk, this.state.account.mainPKr, this.tokenInput.value, this.state.baseToken, function (hash, err) {
                                    self.checkTxReceipt(hash);
                                });
                            }}>提交</Button>}
                    />
                    <Card.Body>
                        <Flex>
                            <Flex.Item style={{ flex: 2 }}>
                                <div className="ui input">
                                    <input type="text" placeholder="token" ref={el => this.tokenInput = el} onChange={
                                        (e) => {
                                            let value = e.target.value;
                                            this.tokenInput.value = value.toUpperCase();
                                        }
                                    } />
                                </div>
                            </Flex.Item>
                            <Flex.Item style={{ flex: 1 }}>
                                <button className="ui button" onClick={() => {
                                    if (this.state.tabs.length <= 1) {
                                        return;
                                    }
                                    let list = [];
                                    this.state.tabs.forEach(function (each, index) {
                                        list.push(
                                            {
                                                text: <span>{each.title}</span>, onPress: () => {
                                                    self.setState({ baseToken: each.title });
                                                }
                                            }
                                        );
                                    });
                                    operation(list);
                                }}><span>{this.state.baseToken}</span><Icon type={"down"} size="xxs" /></button>
                            </Flex.Item>
                        </Flex>
                    </Card.Body>
                </Card>
                <WhiteSpace size="sm" />

                <List renderHeader={() => {
                    return (
                        <Tabs tabs={this.state.tabs}
                            initialPage={0}
                            renderTab={tab => <span style={{}}>{tab.title}</span>}
                            onChange={(tab, index) => {
                                self._init(tab.title);
                            }}
                        >
                        </Tabs>
                    )
                }}>
                    <List.Item>
                        <div style={{ float: "left", width: "45%" }}>{language.e().home.name}</div>
                        <div style={{ float: "left", width: "30%" }}>{language.e().home.lastPrice}</div>
                        <div style={{ float: "right", width: "23%", textAlign: "right" }}>24H<img src={require("../icon/24h.png")} /></div>
                    </List.Item>
                    {tokenPairs}
                </List>
            </WingBlank>)
    }
}

export default Market