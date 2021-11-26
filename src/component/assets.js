import React, { } from 'react';
import { Modal, WhiteSpace, WingBlank } from 'antd-mobile';
import 'semantic-ui-css/semantic.min.css';
import BigNumber from "bignumber.js";
import { createHashHistory } from 'history'

import mAbi from "./abi";
import { showValue } from "./common";
import language from './language'
import Base from './base.js';

class Assets extends Base {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: "asset",
            tokens: [],
            filter: false,
            balances: [],
        };
    }

    _init() {
        let self = this;
        mAbi.balances(this.state.account.mainPKr, function (balances) {

            balances.sort(function (a, b) {
                let valueA = new BigNumber(a.balance[0]).plus(new BigNumber(a.balance[1])).multipliedBy(new BigNumber(10).pow(mAbi.getDecimal(a.token))).toNumber();
                let valueB = new BigNumber(b.balance[0]).plus(new BigNumber(b.balance[1])).multipliedBy(new BigNumber(10).pow(mAbi.getDecimal(b.token))).toNumber();
                return valueB - valueA;
            });
            self.setState({ balances: balances });
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
                }} />
        </div>

        Modal.alert(title, input,
            [
                { text: <span>取消</span> },
                {
                    text: <span>确定</span>, onPress: () => {
                        let decimals = localStorage.getItem("D_" + token);
                        let value = new BigNumber(this.valueInput.value).multipliedBy(new BigNumber(10).pow(decimals));
                        if (type === "recharge") {
                            mAbi.recharge(self.state.pk, self.state.mainPKr, token, value);
                        } else {
                            mAbi.withdraw(self.state.pk, self.state.mainPKr, token, value, function (hash) {
                                self.checkTxReceipt(hash);
                            });
                        }
                    }
                },
            ])
    }


    _render() {
        let self = this;

        let rows = [];
        this.state.balances.map((each, index) => {
            let decimals = mAbi.getDecimal(each.token);
            let availValue = new BigNumber(each.balance[0]).plus(new BigNumber(each.balance[1]));
            if (self.state.filter) {
                let val = availValue.dividedBy(new BigNumber(10).pow(decimals));
                if (val.isZero()) {
                    return 0;
                }
            }
            rows.push((<div key={index} className="ui card" style={{ width: '100%' }}>
                <div className="content">
                    <img alt="" src={'https://edenworkroom.gitee.io/logo/static/' + each.token + '.png'}
                        style={{ width: '30px', height: '30px' }}
                        className="ui mini left floated image" />
                    <div className="header">{each.token}</div>
                    {/*<div className="meta">{token}</div>*/}
                    <div className="description">
                        <div className="ui three column grid aligned container">
                            <div className="row">
                                <div className="column">
                                    <div className="ui aligned">{language.e().assets.total}</div>
                                    <div
                                        className="ui aligned">{showValue(availValue, decimals, 9)}</div>
                                </div>
                                <div className="column">
                                    <div className="ui aligned">{language.e().assets.available}</div>
                                    <div className="ui aligned">{showValue(each.balance[0], decimals, 9)}</div>
                                </div>
                                <div className="column">
                                    <div className="ui aligned">{language.e().assets.locked}</div>
                                    <div className="ui aligned">{showValue(each.balance[1], decimals, 9)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="extra content">
                    <div className="ui four buttons">
                        <button className="ui green basic button"
                            onClick={self.op.bind(self, each.token, "withdraw")}>{language.e().assets.withdrawal}
                        </button>
                        <button className="ui green basic button"
                            onClick={() => {
                                createHashHistory().push("/bills/" + each.token);
                            }}>账单
                        </button>
                        <button disabled={true} className="ui green basic button" onClick={() => {
                            if (each.token !== "SERO") {
                                createHashHistory().push("/trade");
                            }
                        }}>{language.e().assets.trade}
                        </button>
                    </div>
                </div>
            </div>));
        });
        return (
            <div>
                <WingBlank>
                    <div style={{ textAlign: 'right', paddingRight: '5px' }}>
                        <label><input className="my-radio" readOnly={true} checked={this.state.filter} type="radio"
                            onClick={() => {
                                this.setState({ filter: !this.state.filter });
                            }} /><span>&nbsp;&nbsp;隐藏小额资产</span> </label>
                    </div>
                </WingBlank>
                <WhiteSpace size="sm" />
                <WingBlank>
                    <div className="ui cards" style={{ paddingBottom: '40px' }}>
                        {rows}
                    </div>
                </WingBlank>
            </div>
        );
    }
}

export default Assets;