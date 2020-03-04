const list = ["zh_CN", "en_US", "be_BY", "ja_JP", "ko_KR"];

class Language {

    set = (_lang) => {
        if (list.indexOf(_lang) > -1) {
            localStorage.setItem("language", _lang)
        } else {
            localStorage.setItem("language", "en_US")
        }
    }

    e = () => {
        const lang = localStorage.getItem("language");
        if (lang === "zh_CN") {
            return this.zh_CN;
        } else if (lang === "en_US") {
            return this.en_US;
        } else if (lang === "be_BY") {
            return this.be_BY;
        } else if (lang === "ja_JP") {
            return this.ja_JP;
        } else if (lang === "ko_KR") {
            return this.ko_KR;
        } else {
            let localUtc = new Date().getTimezoneOffset() / 60;
            if (localUtc === -8) {
                return this.zh_CN;
            } else {
                return this.en_US;
            }
        }
    }

    zh_CN = {
        text: "语言",
        Button: {
            ok: "确定",
            cancek: "取消"
        },
        tabBar: {
            price: "行情",
            trade: "交易",
            assets: "资产"
        },
        home: {
            account: "账号",
            change: "切换",
            name: "名称",
            trade: "交易",
            lastPrice: "最新价",
        },
        trade: {
            buy: "买入",
            sell: "卖出",
            orderPrice: "委托价格",
            orderNum: "数量",
            available: "可用",
            amount: "交易额",

            price: "价格",
            num: "数量",

            openOrders: "当前委托",
            all: "全部",
            cancle: "撤消",
            cancelAll: "全部撤消",

            finished: "已完成",
            canceled: "已撤消",
            total: "数量",
            volume: "交易量"
        },
        assets: {
            total: "总量",
            available: "可用数量",
            locked: "锁定数量",
            rechange: "充值",
            withdrawal: "提现",
            trade: "交易",
            num: "数量"
        }
    };

    en_US = {
        text: "Language",
        Button: {
            ok: "OK",
            cancek: "Cancel"
        },
        tabBar: {
            price: "Markets",
            trade: "Trade",
            assets: "Assets"
        },
        home: {
            account: "Account",
            change: "Change",
            name: "Name",
            trade: "Trade",
            lastPrice: "LastPrice",
        },
        trade: {
            buy: "Buy",
            sell: "Sell",
            orderPrice: "Price",
            orderNum: "Amount",
            available: "Avail",
            amount: "Amount",

            price: "Price",
            num: "Amount",

            openOrders: "Open Orders",
            all: "ALL",
            cancle: "Cancel",
            cancelAll: "Cancel All",

            finished: "Completed",
            canceled: "Canceled",
            total: "Total",
            volume: "Volume"
        },

        assets: {
            total: "Total",
            available: "Available",
            locked: "On orders",
            rechange: "Rechange",
            withdrawal: "Withdrawal",
            trade: "Trade",
            num: "Amount"
        }
    };

    be_BY = {
        text: "语言",
        Button: {
            ok: "确定",
            cancek: "取消"
        },
        tabBar: {
            price: "行情",
            trade: "交易",
            assets: "资产"
        },
        home: {
            account: "账号",
            change: "切换",
            name: "名称",
            trade: "交易",
            lastPrice: "最新价",
        },
        trade: {
            buy: "买入",
            sell: "卖出",
            orderPrice: "委托价格",
            orderNum: "数量",
            available: "可用",
            amount: "交易额",

            price: "价格",
            num: "数量",

            openOrders: "当前委托",
            all: "全部",
            cancle: "撤消",
            cancelAll: "全部撤消",

            finished: "已完成",
            canceled: "已撤消",
            total: "数量",
            volume: "交易量"
        },
        assets: {
            total: "总量",
            available: "可用数量",
            locked: "锁定数量",
            rechange: "充值",
            withdrawal: "提现",
            trade: "交易",
            num: "数量"
        }
    };

    ja_JP = {
        text: "语言",
        Button: {
            ok: "确定",
            cancek: "取消"
        },
        tabBar: {
            price: "行情",
            trade: "交易",
            assets: "资产"
        },
        home: {
            account: "账号",
            change: "切换",
            name: "名称",
            trade: "交易",
            lastPrice: "最新价",
        },
        trade: {
            buy: "买入",
            sell: "卖出",
            orderPrice: "委托价格",
            orderNum: "数量",
            available: "可用",
            amount: "交易额",

            price: "价格",
            num: "数量",

            openOrders: "当前委托",
            all: "全部",
            cancle: "撤消",
            cancelAll: "全部撤消",

            finished: "已完成",
            canceled: "已撤消",
            total: "数量",
            volume: "交易量"
        },
        assets: {
            total: "总量",
            available: "可用数量",
            locked: "锁定数量",
            rechange: "充值",
            withdrawal: "提现",
            trade: "交易",
            num: "数量"
        }
    };

    ko_KR = {
        text: "语言",
        Button: {
            ok: "确定",
            cancek: "取消"
        },
        tabBar: {
            price: "行情",
            trade: "交易",
            assets: "资产"
        },
        home: {
            account: "账号",
            change: "切换",
            name: "名称",
            trade: "交易",
            lastPrice: "最新价",
        },
        trade: {
            buy: "买入",
            sell: "卖出",
            orderPrice: "委托价格",
            orderNum: "数量",
            available: "可用",
            amount: "交易额",

            price: "价格",
            num: "数量",

            openOrders: "当前委托",
            all: "全部",
            cancle: "撤消",
            cancelAll: "全部撤消",

            finished: "已完成",
            canceled: "已撤消",
            total: "数量",
            volume: "交易量"
        },
        assets: {
            total: "总量",
            available: "可用数量",
            locked: "锁定数量",
            rechange: "充值",
            withdrawal: "提现",
            trade: "交易",
            num: "数量"
        }
    };
};

const language = new Language();
export default language