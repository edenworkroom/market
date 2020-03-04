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
            cancel: "撤消",
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
            lastPrice: "Last Price",
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
            cancel: "Cancel",
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
        text: "языка",
        Button: {
            ok: "OK",
            cancek: "Отмена"
        },
        tabBar: {
            price: "рынки",
            trade: "торговать",
            assets: "активы"
        },
        home: {
            account: "учетная запись",
            change: "изменить",
            name: "имя",
            trade: "торговать",
            lastPrice: "Последняя цена",
        },
        trade: {
            buy: "купить",
            sell: "продавать",
            orderPrice: "Цена",
            orderNum: "сумма",
            available: "доступный",
            amount: "сумма",

            price: "Цена",
            num: "сумма",

            openOrders: "Открытые заказы",
            all: "все",
            cancel: "Отмена",
            cancelAll: "Отменить все",

            finished: "Завершенный",
            canceled: "отменен",
            total: "общее количество",
            volume: "объем"
        },

        assets: {
            total: "Итоговый баланс",
            available: "Доступный",
            locked: "в заказах",
            rechange: "перезарядка",
            withdrawal: "Сумма вывода",
            trade: "торговать",
            num: "количество"
        }
    };

    ja_JP = {
        text: "言語",
        Button: {
            ok: "OK",
            cancek: "キャンセル"
        },
        tabBar: {
            price: "市場",
            trade: "トレード",
            assets: "資産"
        },
        home: {
            account: "アカウント",
            change: "変化する",
            name: "名前",
            trade: "トレード",
            lastPrice: "最後価格",
        },
        trade: {
            buy: "購入",
            sell: "売る",
            orderPrice: "価格",
            orderNum: "量",
            available: "利用可能",
            amount: "量",

            price: "価格",
            num: "量",

            openOrders: "未処理の注文",
            all: "すべて",
            cancel: "キャンセル",
            cancelAll: "すべてキャンセル",

            finished: "完成した",
            canceled: "キャンセル",
            total: "合計",
            volume: "ボリューム"
        },

        assets: {
            total: "合計",
            available: "利用可能",
            locked: "順番に",
            rechange: "保証金",
            withdrawal: "撤回",
            trade: "トレード",
            num: "量"
        }
    };

    ko_KR = {
        text: "언어",
        Button: {
            ok: "OK",
            cancek: "취소"
        },
        tabBar: {
            price: "시장",
            trade: "무역",
            assets: "자산"
        },
        home: {
            account: "계정",
            change: "변화",
            name: "이름",
            trade: "무역",
            lastPrice: "마지막 가격",
        },
        trade: {
            buy: "구입",
            sell: "팔다",
            orderPrice: "가격",
            orderNum: "양",
            available: "이용할 수 있는",
            amount: "양",

            price: "가격",
            num: "양",

            openOrders: "주문 열기",
            all: "모두",
            cancel: "취소",
            cancelAll: "모두 취소",

            finished: "완성됨",
            canceled: "취소 된",
            total: "합계",
            volume: "음량"
        },

        assets: {
            total: "합계",
            available: "사용 가능한 잔액",
            locked: "순서대로",
            rechange: "재충전",
            withdrawal: "철수",
            trade: "무역",
            num: "양"
        }
    };
};

const language = new Language();
export default language