import React, {Component} from 'react';
import {Modal, WingBlank} from 'antd-mobile';
import MTabbar from "./tabbar";
import 'semantic-ui-css/semantic.min.css';
import BigNumber from "bignumber.js";
import {createHashHistory} from 'history'

import pairs from "./pairs";
import mAbi from "./abi";
import {decimals, showPK, tokenToBytes} from "./common";
import language from './language'

class Assets extends Component {
    constructor(props) {
        super(props);

        let tokens = new Array();
        pairs.TOKENS.forEach(function (val, token) {
            tokens.push(token);
        });

        this.state = {
            pk: localStorage.getItem("PK"),
            mainPKr: "",
            tokens: tokens,
            balanceMap: {}
        };
    }

    componentDidMount() {
        let self = this;
        mAbi.init.then(() => {
            mAbi.accountDetails(this.state.pk, function (account) {
                self.setState({mainPKr: account.mainPKr})
                self.initBalances(account.mainPKr);
                setInterval(function () {
                    self.initBalances(self.state.mainPKr);
                }, 20 * 1000)
            });
            mAbi.initLanguage(function (_lang) {
                language.set(_lang);
            });
        })
    }

    initBalances(mainPKr) {
        let self = this;
        mAbi.balanceOf(mainPKr, this.state.tokens, function (maps) {
            self.setState({balanceMap: maps});
        })
    }

    op(token, symbol, type) {
        let self = this;

        let title = (type === "recharge" ? language.e().assets.rechange : language.e().assets.withdrawal) + " " + symbol;
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
                        let decmail = pairs.getDecimals(token);
                        console.log(this.valueInput);
                        let value = new BigNumber(this.valueInput.value).multipliedBy(new BigNumber(10).pow(decmail));
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
        let rows = this.state.tokens.map((token, index) => {
            let balance = this.state.balanceMap[token];
            if (!this.state.balanceMap[token]) {
                balance = [0, 0];
            }
            let decimal = pairs.getDecimals(token);
            let symbol = pairs.getSymbol(token);

            return (<div key={index} className="ui card" style={{width: '100%'}}>
                <div className="content">
                    <img src={require('../icon/' + token + '.png')} style={{width: '30px', height: '30px'}}
                         className="ui mini left floated image"/>
                    <div className="header">{symbol}</div>
                    <div className="meta">{token}</div>
                    <div className="description">
                        <div className="ui three column grid aligned container">
                            <div className="row">
                                <div className="column">
                                    <div className="ui aligned">{language.e().assets.total}</div>
                                    <div className="ui aligned">{decimals(balance[0] + balance[1], decimal, 3)}</div>
                                </div>
                                <div className="column">
                                    <div className="ui aligned">{language.e().assets.available}</div>
                                    <div className="ui aligned">{decimals(balance[0], decimal, 3)}</div>
                                </div>
                                <div className="column">
                                    <div className="ui aligned">{language.e().assets.locked}</div>
                                    <div className="ui aligned">{decimals(balance[1], decimal, 3)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="extra content">
                    <div className="ui three buttons">
                        <button className="ui green basic button" disabled={pairs.isOffLine(token)}
                                onClick={self.op.bind(self, token, symbol, "recharge")}>{language.e().assets.rechange}
                        </button>
                        <button className="ui green basic button"
                                onClick={self.op.bind(self, token, symbol, "withdraw")}>{language.e().assets.withdrawal}
                        </button>
                        <button disabled={token == "SERO"} className="ui green basic button" onClick={() => {
                            if (token !== "SERO") {
                                localStorage.setItem("TOKEN", token);
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
                <WingBlank>
                    <div className="ui cards" style={{paddingTop: '15px', paddingBottom: '40px'}}>
                        {/*<div className="ui card green" style={{width: '100%'}}>*/}
                        {/*    <div className="content">*/}
                        {/*        <div className="header">账号: <span*/}
                        {/*            style={{paddingLeft: '10px'}}>{showPK(this.state.pk, 12)}</span></div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        {rows}
                    </div>

                </WingBlank>
                <MTabbar selectedTab="asset" pk={this.state.pk}/>
            </div>
        );
    }
}

export default Assets;