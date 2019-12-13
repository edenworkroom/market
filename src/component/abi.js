import serojs from 'serojs'
import seropp from 'sero-pp'
import BigNumber from 'bignumber.js'
import {Toast} from "antd-mobile";
import {decimals, tokenToBytes} from "./common";

const config = {
    name: "DMarket",
    contractAddress: "5doTBjS2uBVPezABzavV6PufKACGvuC1Uq4Y4zPPPATawFxvucSwJ22CCpFyB4MShZczbwQwPJkP5q7ZGAajheV",
    github: "https://gitee.com/edenworkroom/market",
    author: "edenworkroom@163.com",
    url: document.location.href,
    logo: document.location.protocol + '//' + document.location.host + '/market/logo.png'
}

const abiJson = [{"constant":false,"inputs":[{"name":"tokenStr","type":"string"},{"name":"cashStr","type":"string"}],"name":"addPair","outputs":[{"name":"key","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tokenStr","type":"string"},{"name":"value","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"fee","type":"uint256"}],"name":"setTokenFee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tokenFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"recharge","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"keys","type":"bytes32[]"}],"name":"lastPrice","outputs":[{"name":"json","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"chargeFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tokens","type":"bytes32[]"}],"name":"balanceOf","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"key","type":"bytes32"}],"name":"orders","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"key","type":"bytes32"}],"name":"pairInfo","outputs":[{"name":"price","type":"uint256[]"},{"name":"buyListJson","type":"string"},{"name":"sellListJson","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"key","type":"bytes32"},{"name":"orderId","type":"bytes32"},{"name":"orderType","type":"bool"}],"name":"cancel","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"key","type":"bytes32"},{"name":"price","type":"uint256[]"},{"name":"value","type":"uint256"}],"name":"sell","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"key","type":"bytes32"},{"name":"price","type":"uint256[]"},{"name":"value","type":"uint256"}],"name":"buy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}];
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

    orders(from, key, callback) {
        this.callMethod('orders', from, [key], function (json) {
            callback(JSON.parse(json));
        });
    }

    orders(from, key, callback) {
        this.callMethod('orders', from, [key], function (json) {
            console.log("orders", json);
            callback(JSON.parse(json));
        });
    }

    pairInfo(from, key, callback) {
        this.callMethod('pairInfo', from, [key], function (vals) {
            console.log("pairInfo", vals);
            callback({
                lastPrice: vals[0],
                buyList: JSON.parse(vals[1]),
                sellList: JSON.parse(vals[2])
            });
        });
    }

    lastPrice(from, keys, callback) {
        this.callMethod('lastPrice', from, [keys], function (json) {
            callback(JSON.parse(json));
        });
    }


    balanceOf(from, tokens, callback) {
        let list = new Array();
        tokens.forEach((token) => {
            list.push(tokenToBytes(token));
        });
        this.callMethod('balanceOf', from, [list], function (json) {
            console.log("balanceOf", tokens, json);
            callback(JSON.parse(json));
        });
    }

    buy(pk, mainPKr, key, price, value, callback) {
        this.executeMethod('buy', pk, mainPKr, [key, price, value], "SERO", 0, callback);
    }

    sell(pk, mainPKr, key, price, value, callback) {
        this.executeMethod('sell', pk, mainPKr, [key, price, value], "SERO", 0, callback);
    }

    cancel(pk, mainPKr, key, orderId, orderType, callback) {
        this.executeMethod('cancel', pk, mainPKr, [key, orderId, orderType], "SERO", 0, callback);
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
