import React, { Component } from 'react';
import { Modal, Toast, NavBar } from "antd-mobile";

import { showAccount } from "./common";
import mAbi from './abi';

import language from './language'
import MTabbar from "./tabbar";

const operation = Modal.operation;

class Base extends Component {
    constructor(props) {
        super();
    }

    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    init(account) {
        let self = this;

        localStorage.setItem("PK", account.pk);
        self.setState({ account: account }, function () {
            if (self._init) {
                self._init();
            
                self.timer = setInterval(self._init(), 10 * 1000);
            }
        });
    }

    componentDidMount() {
        let self = this;
        mAbi.init
            .then(() => {
                let pk = localStorage.getItem("PK");
                if (pk) {
                    mAbi.accountDetails(pk, function (account) {
                        self.init(account);
                    });
                } else {
                    mAbi.accountList(function (accounts) {
                        self.init(accounts[0]);
                        return;
                    });
                }

                
                mAbi.initLanguage(function (_lang) {
                    language.set(_lang);
                });
            })
    }

    checkTxReceipt(hash) {
        if (hash) {
            let self = this;
            Toast.loading("padding", 0);
            mAbi.checkTxReceipt(hash, () => {
                Toast.hide();
                if (self._init) {
                    self._init();
                }
            });
        }
    }

    changAccount() {
        let self = this;
        mAbi.accountList(function (accounts) {
            let actions = [];
            accounts.forEach(function (account, index) {
                actions.push(
                    {
                        text: <span>{account.name + ":" + showAccount(account)}</span>, onPress: () => {
                            localStorage.setItem("PK", account.pk);
                            self.setState({ account: account }, function () {
                                if (self._init) {
                                    self._init();
                                }
                            });
                        }
                    }
                );
            });
            operation(actions);
        });
    }

    render() {
        return (
            <div style={{ minHeight: document.documentElement.clientHeight }}>
                <NavBar key="header"
                    mode="light"
                    leftContent={this.state.account?.name}
                    onLeftClick={() => console.log('onLeftClick')}
                    rightContent={[
                        <span key="account" onClick={() => {
                            this.changAccount();
                        }}><img src={require('../icon/user.png')} alt="" className='am-icon-md am-icon' />
                        </span>
                    ]}
                ></NavBar>
                {this._render && this._render()}
                <MTabbar selectedTab={this.state.selectedTab} />
            </div>
        )

    }
}

export default Base