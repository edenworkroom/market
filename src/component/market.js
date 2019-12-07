import serojs from 'serojs'
import seropp from 'sero-pp'
import BigNumber from 'bignumber.js'
import {formatDate, decimals} from './utils'
import {Toast} from "antd-mobile";

const config = {
    name: "TRADE",
    contractAddress: "",
    github: "https://gitee.com/edenworkroom/market",
    author: "edenworkroom@163.com",
    url: document.location.href,
    logo: document.location.protocol + '//' + document.location.host + '/market/logo.png'
}

const abi = [{
    "constant": false,
    "inputs": [{"name": "token", "type": "bytes32"}, {"name": "value", "type": "uint256"}],
    "name": "withdraw",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "tokenStr", "type": "string"}, {"name": "cashStr", "type": "string"}],
    "name": "addPair",
    "outputs": [{"name": "key", "type": "bytes32"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "token", "type": "bytes32"}],
    "name": "selfAddPair",
    "outputs": [{"name": "key", "type": "bytes32"}],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "fee", "type": "uint256"}],
    "name": "setTokenFee",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "name", "type": "string"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}, {"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "tokenFee",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
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
    "constant": true,
    "inputs": [{"name": "key", "type": "bytes32"}, {"name": "orderId", "type": "bytes32"}],
    "name": "orderInfo",
    "outputs": [{"name": "price", "type": "uint256[2]"}, {"name": "value", "type": "uint256"}, {
        "name": "dealValue",
        "type": "uint256"
    }, {"name": "create_time", "type": "uint256"}, {"name": "status", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "chargeFee",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
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
    "outputs": [{"name": "token", "type": "string"}, {"name": "cash", "type": "string"}, {
        "name": "buyListJson",
        "type": "string"
    }, {"name": "sellListJson", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "key", "type": "bytes32"}, {"name": "orderId", "type": "bytes32"}, {
        "name": "orderType",
        "type": "bool"
    }],
    "name": "cancel",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "key", "type": "bytes32"}, {"name": "price", "type": "uint256[2]"}, {
        "name": "value",
        "type": "uint256"
    }],
    "name": "buy",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "key", "type": "bytes32"}, {"name": "price", "type": "uint256[2]"}, {
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
    "inputs": [{"name": "newOwner", "type": "address"}],
    "name": "transferOwnership",
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
const contract = serojs.callContract(abi, caddress);

class Market {

    constructor() {
        let self = this;
        self.OnInit = new Promise(
            (resolve, reject) => {
                seropp.init(config, function (rest) {
                    if (rest === 'success') {
                        console.log("init success");
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
            let balance = "0";
            if (item.Balance.has("SERO")) {
                balance = decimals(new BigNumber(item.Balance.get("SERO")));
            }
            callback({pk: item.PK, mainPKr: item.MainPKr, name: item.Name, balance: balance})
        });
    }

    accountList(callback) {
        seropp.getAccountList(function (data) {
            let accounts = [];
            data.forEach(function (item, index) {
                let balance = "0";
                if (item.Balance.has("SERO")) {
                    balance = decimals(new BigNumber(item.Balance.get("SERO")));
                }
                accounts.push({pk: item.PK, mainPKr: item.MainPKr, name: item.Name, balance: balance})
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
            callback(JSON.parse(json));
        });
    }

    pairInfo(from, key, callback) {
        this.callMethod('pairInfo', from, [key], function (vals) {
            callback(JSON.parse(vals[2]), JSON.parse(vals[3]));
        });
    }

    balanceOf(from, token, callback) {
        this.callMethod('balanceOf', from, [token], function (vals) {
            callback(new BigNumber(vals[0]), new BigNumber(vals[1]));
        });
    }

    buy(from, mainPKr, key, price, value, callback) {
        this.executeMethod('buy', from, mainPKr, [key, price, value], 0, callback);
    }

    sell(from, mainPKr, key, price, value, callback) {
        this.executeMethod('sell', from, mainPKr, [key, price, value], 0, callback);
    }

    cancel(from, mainPKr, key, orderId, orderType, callback) {
        this.executeMethod('cancel', from, mainPKr, [key, orderId, orderType], 0, callback);
    }

    recharge(from, mainPKr, value, callback) {
        this.executeMethod('recharge', from, mainPKr, [], value, callback);
    }

    withdraw(from, mainPKr, tokenName, value, callback) {
        this.executeMethod('withdraw', from, mainPKr, [tokenName, value], 0, callback);
    }

    selfAddPair(from, mainPKr, tokenName, callback) {
        this.executeMethod('withdraw', from, mainPKr, [tokenName], 0, callback);
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

    executeMethod(_method, from, mainPKr, args, value, callback) {
        let that = this;

        let packData = contract.packData(_method, args);
        let executeData = {
            from: from,
            to: caddress,
            value: "0x" + value.toString(16),
            data: packData,
            gasPrice: "0x" + new BigNumber("1000000000").toString(16),
            cy: "SERO",
        };
        let estimateParam = {
            from: mainPKr,
            to: caddress,
            value: "0x" + value.toString(16),
            data: packData,
            gasPrice: "0x" + new BigNumber("1000000000").toString(16),
            cy: "SERO",
        }
        seropp.estimateGas(estimateParam, function (gas, error) {
            if (error) {
                Toast.fail("Failed to execute smart contract")
            } else {
                executeData["gas"] = gas;
                seropp.executeContract(executeData, function (res) {
                    if (callback) {
                        callback(res)
                    }
                })
            }

        });
    }
}

const tradeplace = new Market();
export default tradeplace;
