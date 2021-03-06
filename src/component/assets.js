import React, {Component} from 'react';
import {Modal, Radio, WhiteSpace, WingBlank} from 'antd-mobile';
import MTabbar from "./tabbar";
import 'semantic-ui-css/semantic.min.css';
import BigNumber from "bignumber.js";
import {createHashHistory} from 'history'

import mAbi from "./abi";
import {showValue, showPK, tokenToBytes} from "./common";
import language from './language'

class Assets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pk: localStorage.getItem("PK"),
            mainPKr: "",
            tokens: [],
            filter: false,
            balanceMap: {},
        };
    }

    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    componentDidMount() {
        let self = this;
        mAbi.init.then(() => {
            mAbi.accountDetails(this.state.pk, function (account) {
                self.setState({mainPKr: account.mainPKr})
                self.initBalances(account.mainPKr);

                self.timer = setInterval(function () {
                    self.initBalances(self.state.mainPKr);
                }, 30 * 1000)
            });
            mAbi.initLanguage(function (_lang) {
                language.set(_lang);
            });
        })
    }

    initBalances(mainPKr) {
        let self = this;
        mAbi.tokenList(mainPKr, "", function (tokens) {
            let list = [];
            let decimalsMap = {};
            tokens.forEach(each => {
                list.push(each.token);
                localStorage.setItem("D_" + each.token, each.decimals);
            });

            mAbi.balanceOf(mainPKr, list, function (maps) {
                self.setState({balanceMap: maps, tokens: tokens});
            });
        })
    }

    op(token, type) {
        let self = this;

        let title = (type === "recharge" ? language.e().assets.rechange : language.e().assets.withdrawal) + " " + token;
        let input = <div className="ui input">
            <input type="number" placeholder={language.e().trade.num}
                   ref={el => this.valueInput = el}
                   onChange={(event) => {
                       let value = event.target.value;
                       if (value) {
                           value = (value.match(/^\d*(\.?\d{0,9})/g)[0]) || null
                           this.valueInput.value = value;
                       } else {
                           this.valueInput.value = "";
                       }
                   }}/>
        </div>

        Modal.alert(title, input,
            [
                {text: <span>取消</span>},
                {
                    text: <span>确定</span>, onPress: () => {
                        let decimals = localStorage.getItem("D_" + token);
                        let value = new BigNumber(this.valueInput.value).multipliedBy(new BigNumber(10).pow(decimals));
                        if (type === "recharge") {
                            mAbi.recharge(self.state.pk, self.state.mainPKr, token, value);
                        } else {
                            mAbi.withdraw(self.state.pk, self.state.mainPKr, token, value);
                        }
                    }
                },
            ])
    }


    render() {
        let self = this;

        let rows = this.state.tokens.map((each, index) => {
            let balance = this.state.balanceMap[each.token];
            if (!this.state.balanceMap[each.token]) {
                balance = [0, 0];
            }

            if (self.state.filter) {
                let temp = {};
                let val = new BigNumber(balance[0]).dividedBy(new BigNumber(10).pow(each.decimals));
                if (val.isZero()) {
                    return
                }
            }

            return (<div key={index} className="ui card" style={{width: '100%'}}>
                <div className="content">
                    <img src={'https://edenworkroom.gitee.io/logo/static/' + each.token + '.png'}
                         style={{width: '30px', height: '30px'}}
                         className="ui mini left floated image"/>
                    <div className="header">{each.token}</div>
                    {/*<div className="meta">{token}</div>*/}
                    <div className="description">
                        <div className="ui three column grid aligned container">
                            <div className="row">
                                <div className="column">
                                    <div className="ui aligned">{language.e().assets.total}</div>
                                    <div
                                        className="ui aligned">{showValue(balance[0] + balance[1], each.decimals, 3)}</div>
                                </div>
                                <div className="column">
                                    <div className="ui aligned">{language.e().assets.available}</div>
                                    <div className="ui aligned">{showValue(balance[0], each.decimals, 3)}</div>
                                </div>
                                <div className="column">
                                    <div className="ui aligned">{language.e().assets.locked}</div>
                                    <div className="ui aligned">{showValue(balance[1], each.decimals, 3)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="extra content">
                    <div className="ui four buttons">
                        <button className="ui green basic button"
                                onClick={self.op.bind(self, each.token, "recharge")}>{language.e().assets.rechange}
                        </button>
                        <button className="ui green basic button"
                                onClick={self.op.bind(self, each.token, "withdraw")}>{language.e().assets.withdrawal}
                        </button>
                        <button className="ui green basic button"
                                onClick={() => {
                                    createHashHistory().push("/bills/" + each.token);
                                }}>账单
                        </button>
                        <button disabled={each.token == "SERO"} className="ui green basic button" onClick={() => {
                            if (each.token !== "SERO") {
                                localStorage.setItem("TOKEN", each.token);
                                localStorage.setItem("STANDARD", "SERO");
                                createHashHistory().push("/trade");
                            }
                        }}>{language.e().assets.trade}
                        </button>
                    </div>
                </div>
            </div>)
        });
        return (
            <div>
                <WhiteSpace size="sm"/>
                <WingBlank>
                    <div style={{textAlign: 'right', paddingRight: '5px'}}>
                        <label><input className="my-radio" readOnly={true} checked={this.state.filter} type="radio"
                                      onClick={() => {
                                          this.setState({filter: !this.state.filter});
                                          this.initBalances(this.state.mainPKr);
                                      }}/><span>&nbsp;&nbsp;隐藏小额资产</span> </label>
                    </div>
                </WingBlank>
                <WhiteSpace size="sm"/>
                <WingBlank>
                    <div className="ui cards" style={{paddingBottom: '40px'}}>
                        {rows}
                    </div>
                </WingBlank>
                <MTabbar selectedTab="asset" pk={this.state.pk}/>
            </div>
        );
    }
}

export default Assets;