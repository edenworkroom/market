import React, {Component} from 'react';
import {Modal, default as Toast, WingBlank, InputItem} from 'antd-mobile';
import MTabbar from "./tabbar";
import 'semantic-ui-css/semantic.min.css';
import BigNumber from "bignumber.js";

import pairs from "./pairs";
import mAbi from "./abi";
import {decimals, showPK, tokenToBytes} from "./common";

const prompt = Modal.prompt;
const operation = Modal.operation;

class Asset extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pk: "",
            mainPKr: "",
            tokens: [],
            balanceMap: {}
        };
    }

    componentDidMount() {
        let self = this;
        mAbi.init.then(() => {
            mAbi.accountList(function (accounts) {
                self.setState({pk: accounts[0].pk, mainPKr: accounts[0].mainPKr});
                self.initBalances(accounts[0].mainPKr);
                setInterval(function () {
                    self.initBalances(self.state.mainPKr);
                }, 20 * 1000)
            });
        })
    }

    initBalances(mainPKr) {
        let self = this;
        let tokens = new Array();

        pairs.TOKENS.forEach(function (val, token) {
            tokens.push(token);
        });
        mAbi.balanceOf(mainPKr, tokens, function (maps) {
            self.setState({tokens: tokens, balanceMap: maps});
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
                            self.initBalances(account.mainPKr);
                        }
                    }
                );
            });
            operation(actions);
        });
    }

    op(token, type) {
        let self = this;
        let title = (type === "recharge" ? "充值 " : "提现 ") + token;
        let input = <InputItem ref={el => {
            this.valueInput = el
        }} type="money" moneyKeyboardAlign="left" placeholder="请输入金额"></InputItem>
        Modal.alert(title, input,
            [
                {text: <span>取消</span>},
                {
                    text: <span>确定</span>, onPress: () => {
                        let decmail = pairs.getDecimals(token);
                        let value = new BigNumber(this.valueInput.state.value).multipliedBy(new BigNumber(10).pow(decmail));
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
            let decimal = pairs.getDecimals(token);
            let symbol = pairs.getSymbol(token);

            return (<div key={index} className="ui card" style={{width: '100%'}}>
                <div className="content">
                    <img src="/images/avatar/large/steve.jpg" className="ui mini left floated image"/>
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
                        <button className="ui green basic button" onClick={self.op.bind(self, token, "recharge")}>充值
                        </button>
                        <button className="ui green basic button" onClick={self.op.bind(self, token, "withdraw")}>提现
                        </button>
                        <button className="ui green basic button">交易</button>
                    </div>
                </div>
            </div>)
        });
        return (
            <WingBlank>
                <div className="ui cards" style={{paddingTop: '15px'}}>
                    <div className="ui card green" style={{width: '100%'}}>
                        <div className="content">
                            <div className="header">账号</div>
                            <div className="meta">
                                <span>{showPK(this.state.pk, 12)}</span>
                                <a className="ui right aligned primary button"
                                   onClick={this.changAccount.bind(this)}>切换</a>
                            </div>
                            <div className="description">
                                Leverage agile frameworks to provide a robust synopsis for high level overviews.
                            </div>
                        </div>
                    </div>
                    {rows}
                </div>
                <MTabbar selectedTab="asset"/>
            </WingBlank>

        );
    }
}

export default Asset;