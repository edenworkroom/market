import React, {Component} from 'react';
import {Button, List, Modal, WingBlank, TabBar, Tabs} from "antd-mobile";
import {createHashHistory} from 'history'

import mAbi from './abi'
import pairs from "./pairs";
import {showValue, hashKey, showPK, showPrice} from "./common";

import MCarousel from './carousel'
import language from './language'
import MTabbar from "./tabbar";

const operation = Modal.operation;

const tabs = [
    {title: 'SERO', sub: '1'},
    {title: 'USDS', sub: '2'},
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
        mAbi.tokenList("2JurSKqbpUMMrpxfzHNajLec6QQ3E7XrhrYCQfDPNBxfXcsgytr5xaB63984AEBAuHRV3h5KwKazNmBTA5PYFTiDSLSeFqq2FvoaXZnCyMburKSe5wk43Yid8DWa48214BuT",
            standard, function (tokens) {
                console.log("tokens", tokens);
                const pairList = new Array();
                tokens.forEach(each => {
                    let info = pairs.getInfo(each.token);
                    let firstPrice = each.firstPrice;
                    let lastPrice = each.lastPrice;
                    let amountOfIncrease = 0;
                    if (firstPrice != 0) {
                        amountOfIncrease = (lastPrice - firstPrice) / firstPrice * 100;
                    }

                    pairList.push({
                        symbol: info.symbol,
                        tokenName: each.token,
                        name: info.name,
                        lastPrice: each.lastPrice,
                        decimals: info.decimals,
                        standard: standard,
                        volume: each.volume,
                        amountOfIncrease: amountOfIncrease
                    })
                });
                pairList.sort(function (a, b) {
                    return b.volume - a.volume;
                });
                console.log("pairList", pairList);
                self.setState({pairList: pairList});
            });
    }

    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
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
                    <div style={{float: "left", width: "45%"}}>
                        {item.symbol} <span style={{fontSize: '14px'}}>{item.name} </span>
                        <div style={{fontSize: '10px', color: '#A8A8A8'}}>
                            {item.tokenName}
                        </div>
                    </div>
                    <div style={{float: "left", width: "28%"}}>
                        {!item.lastPrice ? 0 : showPrice(item.lastPrice, 3)}
                        <div style={{fontSize: '10px', color: '#A8A8A8'}}>
                            {showValue(item.volume, item.decimals, 6)}{item.standard}
                        </div>
                    </div>
                    <div style={{float: "right", width: "27%", textAlign: "right"}}>
                        <Button inline size="small" style={item.amountOfIncrease<0?{backgroundColor: '#D01919',color: 'white'}:{backgroundColor: '#21BA45',color: 'white'}} onClick={() => {
                            localStorage.setItem("TOKEN", item.tokenName);
                            localStorage.setItem("STANDARD", item.standard);
                            createHashHistory().push("/trade");
                        }}><span>
                            {item.amountOfIncrease >= 0 && "+"}
                            {showValue(item.amountOfIncrease, 0, 2)}%</span>
                            </Button>
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
                                          console.log("initPairList", tab.title);
                                          self.initPairList(tab.title);
                                      }}
                                >
                                </Tabs>
                            )
                        }
                        }>
                            <List.Item>
                                <div style={{float: "left", width: "45%"}}>{language.e().home.name}</div>
                                <div style={{float: "left", width: "30%"}}>{language.e().home.lastPrice}</div>
                                <div style={{float: "right", width: "23%", textAlign: "right"}}>24H涨跌</div>
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