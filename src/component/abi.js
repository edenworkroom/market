import serojs from 'serojs'
import seropp from 'sero-pp'
import BigNumber from 'bignumber.js'
import { Toast } from "antd-mobile";
import { decimals, tokenToBytes, bytesToToken } from "./common";
import { JsonRpc } from "./jsonrpc";
const rpc = new JsonRpc();

const config = {
    name: "Rhion DEX",
    contractAddress: "DkesMsTYNKdpjqsP2RcF5E5gcrEKeMmNT2VsNuPwzfoCrsDUnzMw3zCECWda5CAZuLwaLMntYrL9yYU7sdNRcCW",
    github: "https://gitee.com/edenworkroom/market",
    author: "edenworkroom@163.com",
    url: document.location.href,
    logo: 'https://edenworkroom.gitee.io/logo/static/market.png'
}

const abiJson = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [{ "internalType": "string", "name": "_token", "type": "string" }, { "internalType": "string", "name": "_baseToken", "type": "string" }], "name": "addPair", "outputs": [{ "internalType": "bytes32", "name": "key", "type": "bytes32" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "bytes32[]", "name": "tkns", "type": "bytes32[]" }], "name": "balanceOf", "outputs": [{ "components": [{ "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "lockdValue", "type": "uint256" }], "internalType": "struct Market.Balance[]", "name": "list", "type": "tuple[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "baseTokens", "outputs": [{ "internalType": "bytes32[]", "name": "", "type": "bytes32[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "key", "type": "bytes32" }, { "internalType": "uint256", "name": "price", "type": "uint256" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "buy", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "key", "type": "bytes32" }, { "internalType": "bytes32[]", "name": "orderIds", "type": "bytes32[]" }], "name": "cancel", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "token", "type": "bytes32" }], "name": "getBills", "outputs": [{ "components": [{ "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }, { "internalType": "enum AccountInfo.BillType", "name": "bType", "type": "uint8" }], "internalType": "struct AccountInfo.Bill[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "key", "type": "bytes32" }], "name": "off", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "key", "type": "bytes32" }], "name": "on", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "key", "type": "bytes32" }], "name": "orders", "outputs": [{ "components": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "price", "type": "uint256" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "dealValue", "type": "uint256" }, { "internalType": "uint256", "name": "dealAmount", "type": "uint256" }, { "internalType": "uint256", "name": "createTime", "type": "uint256" }, { "internalType": "enum MatchingTxPair.OrderStatus", "name": "status", "type": "uint8" }], "internalType": "struct MatchingTxPair.OrderItem[]", "name": "ordres", "type": "tuple[]" }, { "internalType": "bytes32[]", "name": "orderIds", "type": "bytes32[]" }, { "internalType": "uint256[]", "name": "orderTypes", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pairFee", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "key", "type": "bytes32" }], "name": "pairInfo", "outputs": [{ "internalType": "bytes32", "name": "token", "type": "bytes32" }, { "internalType": "bytes32", "name": "baseToken", "type": "bytes32" }, { "components": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "price", "type": "uint256" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }, { "internalType": "uint8", "name": "opType", "type": "uint8" }], "internalType": "struct TransactionPair.Deal[]", "name": "deals", "type": "tuple[]" }, { "components": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "price", "type": "uint256" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "dealValue", "type": "uint256" }, { "internalType": "uint256", "name": "dealAmount", "type": "uint256" }, { "internalType": "uint256", "name": "createTime", "type": "uint256" }, { "internalType": "enum MatchingTxPair.OrderStatus", "name": "status", "type": "uint8" }], "internalType": "struct MatchingTxPair.OrderItem[]", "name": "buyList", "type": "tuple[]" }, { "components": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "price", "type": "uint256" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "dealValue", "type": "uint256" }, { "internalType": "uint256", "name": "dealAmount", "type": "uint256" }, { "internalType": "uint256", "name": "createTime", "type": "uint256" }, { "internalType": "enum MatchingTxPair.OrderStatus", "name": "status", "type": "uint8" }], "internalType": "struct MatchingTxPair.OrderItem[]", "name": "sellList", "type": "tuple[]" }, { "internalType": "bool", "name": "offline", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "baseToken", "type": "bytes32" }], "name": "pairList", "outputs": [{ "components": [{ "internalType": "bytes32", "name": "token", "type": "bytes32" }, { "internalType": "uint256", "name": "firstPrice", "type": "uint256" }, { "internalType": "uint256", "name": "lastPrice", "type": "uint256" }, { "internalType": "uint256", "name": "volume", "type": "uint256" }, { "internalType": "bool", "name": "offline", "type": "bool" }], "internalType": "struct Market.PairInfo[]", "name": "list", "type": "tuple[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "key", "type": "bytes32" }, { "internalType": "uint256", "name": "price", "type": "uint256" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "sell", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }, { "internalType": "uint256", "name": "_feeRate", "type": "uint256" }], "name": "setFeeRate", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_pairFee", "type": "uint256" }], "name": "setPairFee", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "name": "tokenPairs", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "baseToken", "type": "bytes32" }], "name": "tokens", "outputs": [{ "internalType": "bytes32[]", "name": "", "type": "bytes32[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "tokenStr", "type": "string" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];

const contract = serojs.callContract(abiJson, config.contractAddress);


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

    getTransactionReceipt(txHash, callback){
        seropp.getInfo(function (info) {
            rpc.seroRpc(info.rpc, "sero_getTransactionReceipt", [txHash], function (rest) {
                callback(rest)
            });
        });
    }

    checkTxReceipt(hash, callback) {
        let self = this;
        this.getTransactionReceipt(hash, res => {
            if (res && res.result) {
                if (callback) {
                    callback();
                }
            } else {
                setTimeout(function () {
                    self.checkTxReceipt(hash, callback)
                }, 5000)
            }
        })
    }

    initLanguage(callback) {
        seropp.getInfo(function (info) {
            callback(info.language);
        });
    }

    accountDetails(pk, callback) {
        seropp.getAccountDetail(pk, function (item) {
            callback({ pk: item.PK, mainPKr: item.MainPKr, name: item.Name, balances: item.Balance })
        });
    }

    accountList(callback) {
        seropp.getAccountList(function (data) {
            let accounts = [];
            data.forEach(function (item, index) {
                accounts.push({ pk: item.PK, mainPKr: item.MainPKr, name: item.Name, balances: item.Balance })
            });
            callback(accounts)
        });
    }

    setDecimal(token) {
        seropp.getInfo(function (info) {
            rpc.seroRpc(info.rpc, "sero_getDecimal", [token], function (rets) {
                if (rets) {
                    localStorage.setItem("D_" + token, new BigNumber(rets.result, 16).toNumber());
                }
            });
        });
    }

    getDecimal(token) {
        if (token === "SERO") {
            return 18;
        } else {
            let d = localStorage.getItem("D_" + token)
            if (d) {
                return d;
            } else {
                this.setDecimal(token);
                return null;
            }
        }
    }

    baseTokens(from, callback) {
        let self = this;
        this.callMethod('baseTokens', from, [], function (ret) {
            let list = [];
            ret[0].forEach(each => {
                let token = bytesToToken(each);
                list.push(token);

                if (!localStorage.getItem("D_" + token)) {
                    self.setDecimal(token);
                }
            });
            callback(list);
        });
    }

    tokens(from, baseToken, callback) {
        this.callMethod("tokens", from, [baseToken], function (ret) {
            callback(ret[0]);
        });
    }

    balances(from, callback) {
        let self = this;
        this.callMethod("baseTokens", from, [], function (ret) {
            let bases = ret[0];
            let tasks = [];
            let tokens = [];
            bases.forEach(baseToken => {
                tokens.push(baseToken);
                tasks.push(new Promise((resolve, reject) => {
                    self.tokens(from, baseToken, function (tokens) {
                        resolve(tokens);
                    });
                }));
            });

            Promise.all(tasks).then((values) => {
                values.forEach(each => {
                    tokens.push(...each);
                });
                let list = [];
                self._balanceOf(from, tokens, function (balances) {
                    balances.forEach((balance, token) => {
                        list.push({
                            "token": token,
                            "balance": balance
                        });
                    });
                    callback(list);
                });
            });
        });
    }

    pairList(from, baseToken, callback) {
        let self = this;
        this.callMethod('pairList', from, [baseToken], function (ret) {
            let pairList = ret[0];
            pairList.forEach((each, index, array) => {
                each.token = bytesToToken(each.token);

                let decimals = localStorage.getItem("D_" + each.token);
                if (!decimals) {
                    self.setDecimal(each.token)
                } else {
                    array[index].decimals = decimals;
                }
            })
            callback(pairList);
        });
    }

    orders(from, key, callback) {
        this.callMethod('orders', from, [key], function (ret) {
            let orders = ret[0];
            orders.forEach((each, index) => {
                each.id = ret[1][index];
                each.type = ret[2][index];

            })
            orders.sort(function (a, b) {
                return b.createTime - a.createTime;
            });
            callback(orders);
        });
    }

    getBills(from, token, callback) {
        this.callMethod('getBills', from, [tokenToBytes(token)], function (ret) {
            callback(ret[0]);
        });
    }

    pairInfo(from, key, callback) {
        this.callMethod('pairInfo', from, [key], function (pairInfo) {
            callback(pairInfo);
        });
    }

    balanceOf(from, tokens, callback) {
        let list = [];
        tokens.forEach(each => {
            list.push(tokenToBytes(each));
        });

        this._balanceOf(from, list, function (balances) {
            let rets = {};
            balances.forEach((val, key) => {
                rets[key] = val;
            });
            callback(rets);
        });
    }

    _balanceOf(from, tokens, callback) {
        this.callMethod('balanceOf', from, [tokens], function (ret) {
            let balanceMap = new Map();
            tokens.forEach((token, index) => {
                balanceMap.set(bytesToToken(token), ret[0][index]);
            });
            callback(balanceMap);
        });
    }

    pairFee(from, callback) {
        this.callMethod('pairFee', from, [], function (ret) {
            callback(ret[0]);
        });
    }


    addPair(pk, mainPKr, token, baseToken, callback) {
        let self = this;
        this.pairFee(mainPKr, function (fee) {
            self.executeMethod('addPair', pk, mainPKr, [token, baseToken], "SERO", new BigNumber(fee), callback);
        });
    }

    off(pk, mainPKr, key, callback) {
        this.executeMethod('off', pk, mainPKr, [key], "SERO", 0, callback);
    }

    on(pk, mainPKr, key, callback) {
        this.executeMethod('on', pk, mainPKr, [key], "SERO", 0, callback);
    }

    buy(pk, mainPKr, key, price, value, token, amount, callback) {
        this.executeMethod('buy', pk, mainPKr, [key, price, value], token, amount, callback);
    }

    sell(pk, mainPKr, key, price, value, token, amount, callback) {
        this.executeMethod('sell', pk, mainPKr, [key, price, value], token, amount, callback);
    }

    cancel(pk, mainPKr, key, orderIds, callback) {
        this.executeMethod('cancel', pk, mainPKr, [key, orderIds], "SERO", 0, callback);
    }

    withdraw(pk, mainPKr, tokenName, value, callback) {
        this.executeMethod('withdraw', pk, mainPKr, [tokenName, value.toString()], "SERO", 0, callback);
    }

    callMethod(_method, from, _args, callback) {
        let packData = contract.packData(_method, _args);
        let callParams = {
            from: from,
            to: contract.address,
            data: packData
        }

        seropp.call(callParams, function (callData, err) {
            if (!err) {
                let res = contract.unPackDataEx(_method, callData);
                if (callback) {
                    callback(res);
                }
            } else {
                console.log(err);
            }
        });
    }

    executeMethod(_method, pk, mainPKr, args, tokenName, value, callback) {

        let packData = contract.packData(_method, args);
        let executeData = {
            from: pk,
            to: contract.address,
            value: "0x" + value.toString(16),
            data: packData,
            gasPrice: "0x" + new BigNumber("1000000000").toString(16),
            cy: tokenName,
        };
        let estimateParam = {
            from: mainPKr,
            to: contract.address,
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
                        callback(res, error);
                    }
                })
            }
        });
    }
}

const mAbi = new MAbi();
export default mAbi;
