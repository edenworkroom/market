import React, {Component} from 'react';
import {Button, List, Modal, WingBlank, TabBar, Tabs} from "antd-mobile";
import {createHashHistory} from 'history'

import mAbi from './abi'
import pairs from "./pairs";
import {hashKey, showPK, showPrice} from "./common";

import MCarousel from './carousel'
import language from './language'
import MTabbar from "./tabbar";

const operation = Modal.operation;

const tabs = [
    {title: 'SERO', sub: '1'},
    {title: '其他交易对上架中...', sub: '2'},
];

class Market extends Component {
    constructor(props) {
        super(props);
        let self = this;
        this.state = {
            pairList: [],
            pk: localStorage.getItem("PK")
        }

        let pk = localStorage.getItem("PK");
        if (!pk) {
            mAbi.init
                .then(() => {
                    mAbi.accountList(function (accounts) {
                        localStorage.setItem("PK", accounts[0].pk);
                        self.setState({pk: accounts[0].pk});
                    });
                })
        }
    }

    initPairList(standard) {
        let self = this;
        const keys = new Array();
        const map = new Map();
        pairs.getTokens(standard).forEach(function (token) {
            let key = hashKey(token, standard);
            keys.push(key);
            map[key] = token;
        });

        mAbi.lastPrice("2JurSKqbpUMMrpxfzHNajLec6QQ3E7XrhrYCQfDPNBxfXcsgytr5xaB63984AEBAuHRV3h5KwKazNmBTA5PYFTiDSLSeFqq2FvoaXZnCyMburKSe5wk43Yid8DWa48214BuT", keys, function (pairMap) {
            const pairList = new Array();
            keys.forEach(key => {
                let lastPrice = 0;
                if (pairMap[key]) {
                    lastPrice = pairMap[key];
                }
                pairList.push({
                    symbol: pairs.getSymbol(map[key]),
                    tokenName: map[key],
                    name: pairs.getName(map[key]),
                    lastPrice: lastPrice,
                    decimals: pairs.getDecimals(map[key])
                })
            });
            self.setState({pairList: pairList});
        });
    }

    componentWillUnmount() {
        console.log("componentWillUnmount");
        clearInterval(this.timer);
    }

    componentDidMount() {
        let self = this;
        mAbi.init
            .then(() => {
                self.initPairList("SERO");
                // self.timer = setInterval(self.initPairList(), 10 * 1000);
                mAbi.initLanguage(function (_lang) {
                    language.set(_lang);
                });
            })

    }

    changAccount() {
        let self = this;
        mAbi.accountList(function (accounts) {
            let actions = [];
            accounts.forEach(function (account, index) {
                actions.push(
                    {
                        text: <span>{account.name + ":" + showPK(account.pk)}</span>, onPress: () => {
                            self.setState({pk: account.pk});
                            localStorage.setItem("PK", account.pk);
                        }
                    }
                );
            });
            operation(actions);
        });
    }

    isIOS() {
        var u = navigator.userAgent, app = navigator.appVersion;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        return isIOS;
    }

    render() {
        let self = this;
        const tokenPairs = this.state.pairList.map((item, index) => {
            return (
                <List.Item key={item.tokenName}>
                    <div style={{float: "left", width: "50%"}}>
                        {item.symbol} <span style={{fontSize: '14px'}}>{item.name} </span>
                        <div style={{fontSize: '10px', color: '#A8A8A8'}}>
                            {item.tokenName}
                        </div>
                    </div>
                    <div style={{float: "left", width: "30%"}}>
                        {!item.lastPrice ? 0 : showPrice(item.lastPrice, 3)}
                    </div>
                    <div style={{float: "right", width: "20%", textAlign: "right"}}>
                        <Button type="primary" inline size="small" onClick={() => {
                            localStorage.setItem("TOKEN", item.tokenName);
                            localStorage.setItem("STANDARD", "SERO");
                            createHashHistory().push("/trade");
                        }}>{language.e().home.trade}</Button>
                    </div>
                </List.Item>
            )
        });

        return (
            <div>
                <div style={{paddingTop: "10px", paddingBottom: '40px'}}>
                    <WingBlank>
                        <div style={{float: "clear"}}></div>
                        {
                            this.isIOS() ? <div>
                                <img style={{width: '100%', height: '180px'}} src={require('../icon/1.png')}/>
                            </div> : <MCarousel/>

                        }
                    </WingBlank>
                    <WingBlank>
                        <div>
                            <p role="listitem" className="item">公告：老版本用户提现请用加载 <a
                                href="http://edenworkroom.gitee.io/market_bak">老版本</a>
                            </p>
                        </div>
                        <div style={{paddingTop: '15px'}}>
                            <div style={{padding: '0px 15px'}}>
                                <span
                                    style={{float: 'left'}}>{language.e().home.account} : {showPK(this.state.pk, 12)}</span>
                            </div>
                            <div style={{float: 'right'}}><a
                                onClick={this.changAccount.bind(this)}>{language.e().home.change}</a></div>
                        </div>
                        <div style={{clear: 'both'}}></div>


                        <List style={{paddingTop: '15px'}} renderHeader={() => {
                            return (
                                <Tabs tabs={tabs}
                                      initialPage={0}
                                      renderTab={tab => <span style={{}}>{tab.title}</span>}
                                      onChange={(tab, index) => {
                                          self.initPairList(tab.title);
                                      }}
                                >
                                </Tabs>
                            )
                        }
                        }>
                            <List.Item>
                                <div style={{float: "left", width: "50%"}}>{language.e().home.name}</div>
                                <div style={{float: "left", width: "30%"}}>{language.e().home.lastPrice}</div>
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