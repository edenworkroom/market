import React, {Component} from 'react';
import {Button, List, Modal, WingBlank, TabBar, Tabs, InputItem, Flex} from "antd-mobile";
import {createHashHistory} from 'history'

import mAbi from './abi'
import {showValue, hashKey, showPK, showPrice, showToken} from "./common";

import MCarousel from './carousel'
import language from './language'
import MTabbar from "./tabbar";

const operation = Modal.operation;

const tabs = [
    {title: 'SERO', sub: '1'},
    {title: '....', sub: '2'},
];

const onwer = "27HNFfDDxPxP34wceqRyJ4DD4qZrCBLwVEzbqerscRwAFase4zdzcqECr1kFHtWwueMEM7zgEbo1ts5SftZDVGKeMZ4FEWQBca9J56Nr19m2Z3aJJGzCZ3MVfR47NcxF8buT";

class Market extends Component {
    constructor(props) {
        super(props);
        let self = this;
        this.state = {
            pairList: [],
            pk: localStorage.getItem("PK"),
            mainPKr: localStorage.getItem("MAINPKR")
        }

        let pk = localStorage.getItem("PK");
        if (!pk) {
            mAbi.init
                .then(() => {
                    mAbi.accountList(function (accounts) {
                        localStorage.setItem("PK", accounts[0].pk);
                        localStorage.setItem("MAINPKR", accounts[0].mainPKr);
                        self.setState({pk: accounts[0].pk, mainPKr: accounts[0].mainPKr});
                    });
                })
        }
    }

    initPairList(standard) {
        let self = this;
        mAbi.tokenList("2JurSKqbpUMMrpxfzHNajLec6QQ3E7XrhrYCQfDPNBxfXcsgytr5xaB63984AEBAuHRV3h5KwKazNmBTA5PYFTiDSLSeFqq2FvoaXZnCyMburKSe5wk43Yid8DWa48214BuT",
            standard, function (tokens) {

                console.log("pairList", tokens);
                const pairList = new Array();
                tokens.forEach(each => {
                    let firstPrice = each.firstPrice;
                    let lastPrice = each.lastPrice;
                    let amountOfIncrease = 0;
                    if (firstPrice != 0) {
                        amountOfIncrease = (lastPrice - firstPrice) / firstPrice * 100;
                    }

                    pairList.push({
                        // symbol: info.symbol,
                        tokenName: each.token,
                        // name: info.name,
                        lastPrice: each.lastPrice,
                        decimals: each.decimals,
                        standard: standard,
                        volume: each.volume,
                        amountOfIncrease: amountOfIncrease,
                        offline: each.offline
                    });
                    localStorage.setItem("D_" + each.token, each.decimals);
                });

                pairList.sort(function (a, b) {
                    return b.volume - a.volume;
                });
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
                            self.setState({pk: account.pk, mainPKr: account.mainPKr});
                            localStorage.setItem("PK", account.pk);
                            localStorage.setItem("MAINPKR", account.mainPKr);
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
                    <Flex>
                        <Flex.Item style={{flex: 45}}>
                            <span style={{fontSize: '14px'}}>{showToken(item.tokenName)} </span>
                            <div style={{fontSize: '10px', color: '#A8A8A8'}}>
                                {item.tokenName}
                            </div>
                        </Flex.Item>
                        <Flex.Item style={{flex: 28}}>
                            {!item.lastPrice ? 0 : showPrice(item.lastPrice, 3)}
                            <div style={{fontSize: '10px', color: '#A8A8A8'}}>
                                {showValue(item.volume, item.decimals, 6)}{item.standard}
                            </div>
                        </Flex.Item>
                        <Flex.Item style={{flex: 27, textAlign: "right"}}>
                            <Button inline size="small" style={item.amountOfIncrease < 0 ? {
                                backgroundColor: '#D01919',
                                color: 'white'
                            } : {backgroundColor: '#21BA45', color: 'white'}} onClick={() => {
                                localStorage.setItem("TOKEN", item.tokenName);
                                localStorage.setItem("STANDARD", item.standard);
                                createHashHistory().push("/trade");
                            }}><span>
                            {item.amountOfIncrease >= 0 && "+"}
                                {showValue(item.amountOfIncrease, 0, 2)}%</span>
                            </Button>
                        </Flex.Item>
                    </Flex>
                    {
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
                    }
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
                                <img style={{width: '100%', height: '180px'}}
                                     src={'https://edenworkroom.gitee.io/logo/static/banner_2.png'}/>
                            </div> : <MCarousel/>
                        }
                    </WingBlank>
                    <WingBlank>

                        <div>
                            <p role="listitem" className="item">公告：老版本用户提现请用加载 <a
                                href="http://edenworkroom.gitee.io/old">老版本</a>
                            </p>
                        </div>
                        <Flex style={{paddingTop: '15px'}}>
                            <Flex.Item style={{flex: 85, padding: '0px 15px'}}>
                                <span>{language.e().home.account} : {showPK(this.state.pk, 12)}</span>
                            </Flex.Item>
                            <Flex.Item style={{flex: 15}}>
                                <div><a onClick={this.changAccount.bind(this)}>{language.e().home.change}</a></div>
                            </Flex.Item>
                        </Flex>

                        <div style={{clear: 'both'}}></div>
                        {
                            this.state.mainPKr === onwer &&
                            <List renderHeader={() => ''}>
                                <InputItem
                                    clear
                                    placeholder="token"
                                    ref={el => this.tokenInput = el}
                                >Token</InputItem>
                                <InputItem
                                    clear
                                    placeholder="standard"
                                    ref={el => this.standardInput = el}
                                >Standard</InputItem>
                                <List.Item>
                                    <div
                                        style={{width: '100%', color: '#108ee9', textAlign: 'center'}}
                                        onClick={() => {
                                            let tokenInput = this.tokenInput.state.value;
                                            let tokenVals = tokenInput.split(",");
                                            let token = tokenVals[0].trim();
                                            let tokenD = parseInt(tokenVals[1].trim());
                                            let standardInput = this.standardInput.state.value;
                                            let standardVals = standardInput.split(",");
                                            let standard = standardVals[0].trim();
                                            let standarD = parseInt(standardVals[1].trim());
                                            mAbi.addPair(this.state.pk, this.state.mainPKr, token, tokenD, standard, standarD);
                                        }}
                                    >
                                        提交
                                    </div>
                                </List.Item>
                            </List>
                        }


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