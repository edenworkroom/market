import serojs from 'serojs'
import seropp from 'sero-pp'
import BigNumber from 'bignumber.js'
import {Toast} from "antd-mobile";
import {decimals, tokenToBytes} from "./common";

const config = {
    name: "Rhino Market",
    contractAddress: "41fu6ohxjPUwAYr5xXkqkj6WzBUMruQ8sFciqLkM83GZse6r4p7nT3rJWnMbbKksJtRuHGr1s5wXy7QCd9nSVyHa",
    github: "https://gitee.com/edenworkroom/market",
    author: "edenworkroom@163.com",
    url: document.location.href,
    logo: document.location.protocol + '//' + document.location.host + '/market/logo.png'
}

const abiJson = [{
    "constant": true,
    "inputs": [{"name": "token", "type": "bytes32"}],
    "name": "getBills",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "key", "type": "bytes32"}],
    "name": "on",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "tokenStr", "type": "string"}, {"name": "value", "type": "uint256"}],
    "name": "withdraw",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "recharge",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "key", "type": "bytes32"}],
    "name": "off",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "key", "type": "bytes32"}, {"name": "price", "type": "uint256"}, {
        "name": "value",
        "type": "uint256"
    }],
    "name": "sell",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "token", "type": "bytes32"}, {"name": "tokenD", "type": "uint256"}, {
        "name": "standard",
        "type": "bytes32"
    }, {"name": "standardD", "type": "uint256"}],
    "name": "addPair",
    "outputs": [{"name": "key", "type": "bytes32"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "token", "type": "bytes32"}, {"name": "decimals", "type": "uint256"}],
    "name": "setDecimals",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "tkns", "type": "bytes32[]"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "key", "type": "bytes32"}],
    "name": "orders",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "key", "type": "bytes32"}],
    "name": "pairInfo",
    "outputs": [{"name": "", "type": "string"}, {"name": "", "type": "string"}, {
        "name": "",
        "type": "string"
    }, {"name": "", "type": "bool"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "key", "type": "bytes32"}, {"name": "orderIds", "type": "bytes32[]"}],
    "name": "cancel",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "standard", "type": "bytes32"}],
    "name": "tokenList",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "newOwner", "type": "address"}],
    "name": "transferOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "key", "type": "bytes32"}, {"name": "price", "type": "uint256"}, {
        "name": "value",
        "type": "uint256"
    }],
    "name": "buy",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {"inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor"}, {
    "anonymous": false,
    "inputs": [{"indexed": true, "name": "previousOwner", "type": "address"}, {
        "indexed": true,
        "name": "newOwner",
        "type": "address"
    }],
    "name": "OwnershipTransferred",
    "type": "event"
}];
const caddress = config.contractAddress;
const contract = serojs.callContract(abiJson, caddress);


class MAbi {

    constructor() {
        let self = this;
        self.init = new Promise(
            (resolve, reject) => {
                seropp.init(config, function (rest) {
                    if (rest === 'success') {
                        return resolve()
                    } else {
                        return reject(rest)
                    }
                })
            }
        )
    }

    initLanguage(callback) {
        seropp.getInfo(function (info) {
            callback(info.language);
        });
    }

    accountDetails(pk, callback) {
        let self = this;
        seropp.getAccountDetail(pk, function (item) {
            callback({pk: item.PK, mainPKr: item.MainPKr, name: item.Name, balances: item.Balance})
        });
    }

    accountList(callback) {
        seropp.getAccountList(function (data) {
            let accounts = [];
            data.forEach(function (item, index) {
                accounts.push({pk: item.PK, mainPKr: item.MainPKr, name: item.Name, balances: item.Balance})
            });
            callback(accounts)
        });
    }

    tokenList(from, standard, callback) {
        console.log("tokenList", standard);
        this.callMethod('tokenList', from, [tokenToBytes(standard)], function (json) {
            callback(JSON.parse(json));
        });
    }

    orders(from, key, callback) {
        this.callMethod('orders', from, [key], function (json) {
            let orders = JSON.parse(json);
            orders.sort(function (a, b) {
                return b.createTime - a.createTime;
            });
            callback(orders);
        });
    }

    getBills(from, token, callback) {
        this.callMethod('getBills', from, [tokenToBytes(token)], function (json) {
            callback(JSON.parse(json));
        });
    }

    pairInfo(from, key, callback) {
        this.callMethod('pairInfo', from, [key], function (vals) {
            callback({
                volumes: JSON.parse(vals[0]),
                buyList: JSON.parse(vals[1]),
                sellList: JSON.parse(vals[2]),
                offline: vals[3],
            });
        });
    }

    balanceOf(from, tokens, callback) {
        let list = new Array();
        tokens.forEach((token) => {
            list.push(tokenToBytes(token));
        });
        this.callMethod('balanceOf', from, [list], function (json) {
            callback(JSON.parse(json));
        });
    }

    addPair(pk, mainPKr, token, tokenD, standard, standardD, callback) {
        this.executeMethod('addPair', pk, mainPKr, [token, tokenD, standard, standardD], "SERO", 0, callback);
    }

    off(pk, mainPKr, key, callback) {
        this.executeMethod('off', pk, mainPKr, [key], "SERO", 0, callback);
    }

    on(pk, mainPKr, key, callback) {
        this.executeMethod('on', pk, mainPKr, [key], "SERO", 0, callback);
    }

    buy(pk, mainPKr, key, price, value, callback) {
        this.executeMethod('buy', pk, mainPKr, [key, price, value], "SERO", 0, callback);
    }

    sell(pk, mainPKr, key, price, value, callback) {
        this.executeMethod('sell', pk, mainPKr, [key, price, value], "SERO", 0, callback);
    }

    cancel(pk, mainPKr, key, orderIds, callback) {
        this.executeMethod('cancel', pk, mainPKr, [key, orderIds], "SERO", 0, callback);
    }

    recharge(pk, mainPKr, tokenName, value, callback) {
        this.executeMethod('recharge', pk, mainPKr, [], tokenName, value, callback);
    }

    withdraw(pk, mainPKr, tokenName, value, callback) {
        this.executeMethod('withdraw', pk, mainPKr, [tokenName, value.toString()], "SERO", 0, callback);
    }

    selfAddPair(pk, mainPKr, tokenName, callback) {
        this.executeMethod('withdraw', pk, mainPKr, [tokenName], "SERO", 0, callback);
    }


    callMethod(_method, from, _args, callback) {
        let that = this;
        let packData = contract.packData(_method, _args);
        let callParams = {
            from: from,
            to: caddress,
            data: packData
        }

        seropp.call(callParams, function (callData) {
            if (callData !== "0x") {
                let res = contract.unPackData(_method, callData);
                if (callback) {
                    callback(res);
                }
            } else {
                callback("0x0");
            }
        });
    }

    executeMethod(_method, pk, mainPKr, args, tokenName, value, callback) {
        let that = this;

        let packData = contract.packData(_method, args);
        let executeData = {
            from: pk,
            to: caddress,
            value: "0x" + value.toString(16),
            data: packData,
            gasPrice: "0x" + new BigNumber("1000000000").toString(16),
            cy: tokenName,
        };
        let estimateParam = {
            from: mainPKr,
            to: caddress,
            value: "0x" + value.toString(16),
            data: packData,
            gasPrice: "0x" + new BigNumber("1000000000").toString(16),
            cy: tokenName,
        }
        seropp.estimateGas(estimateParam, function (gas, error) {
            if (error) {
                Toast.fail("Failed to execute smart contract")
            } else {
                executeData["gas"] = gas;
                seropp.executeContract(executeData, function (res, error) {
                    if (callback) {
                        callback(res)
                    }
                })
            }
        });
    }
}

const mAbi = new MAbi();
export default mAbi;
