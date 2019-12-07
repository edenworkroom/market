import serojs from 'serojs'
import seropp from 'sero-pp'
import BigNumber from 'bignumber.js'
import {formatDate, decimals} from './utils'
import {Toast} from "antd-mobile";

const config = {
    name: "TRADE",
    contractAddress: "",
    github: "https://gitee.com/edenworkroom/tradeplace",
    author: "edenworkroom@163.com",
    url: document.location.href,
    logo: document.location.protocol + '//' + document.location.host + '/tradeplace/logo.png'
}

const abi = [];
const caddress = config.contractAddress;
const contract = serojs.callContract(abi, caddress);

class Tradeplace {

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

const tradeplace = new Tradeplace();
export default tradeplace;
