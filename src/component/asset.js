import React, {Component} from 'react';
import {Modal, WingBlank} from 'antd-mobile';
import MTabbar from "./tabbar";
import 'semantic-ui-css/semantic.min.css';
import BigNumber from "bignumber.js";
import {createHashHistory} from 'history'

import pairs from "./pairs";
import mAbi from "./abi";
import {decimals, showPK, tokenToBytes} from "./common";

const operation = Modal.operation;


class Asset extends Component {
    constructor(props) {
        super(props);

        let tokens = new Array();
        pairs.TOKENS.forEach(function (val, token) {
            tokens.push(token);
        });

        this.state = {
            pk: props.match.params.pk,
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
        let title = (type === "recharge" ? "充值 " : "提现 ") + symbol;
        let input = <div className="ui input">
            <input type="number" placeholder="数量"
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
                                    <div className="ui aligned">持有总量</div>
                                    <div className="ui aligned">{decimals(balance[0] + balance[1], decimal, 9)}</div>
                                </div>
                                <div className="column">
                                    <div className="ui aligned">可用数量</div>
                                    <div className="ui aligned">{decimals(balance[0], decimal, 9)}</div>
                                </div>
                                <div className="column">
                                    <div className="ui aligned">锁定数量</div>
                                    <div className="ui aligned">{decimals(balance[1], decimal, 9)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="extra content">
                    <div className="ui three buttons">
                        <button className="ui green basic button"
                                onClick={self.op.bind(self, token, symbol, "recharge")}>充值
                        </button>
                        <button className="ui green basic button"
                                onClick={self.op.bind(self, token, symbol, "withdraw")}>提现
                        </button>
                        <button className="ui green basic button" onClick={() => {
                            if (token !== "SERO") {
                                createHashHistory().push(`/trade/${this.state.pk}/SERO/${token}`);
                            }
                        }}>交易
                        </button>
                    </div>
                </div>
            </div>)
        });
        return (
            <div>
                <WingBlank>
                    <div className="ui cards" style={{paddingTop: '15px', paddingBottom: '40px'}}>
                        <div className="ui card green" style={{width: '100%'}}>
                            <div className="content">
                                <div className="header">账号: <span
                                    style={{paddingLeft: '10px'}}>{showPK(this.state.pk, 12)}</span></div>
                            </div>
                        </div>
                        {rows}
                    </div>

                </WingBlank>
                <MTabbar selectedTab="asset" pk={this.state.pk}/>
            </div>


        );
    }
}

export default Asset;