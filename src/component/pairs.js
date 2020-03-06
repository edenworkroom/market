class Pairs {

    SERO = {
        symbol: "SERO",
        decimals: 18,
        tokens: ["THE_FIRST_PRIVACY_COIN", "ASNOW", "SVVC", "NEWBITS", "NBHBOS", "VIRTUE", "ORIGO", "USDS"]
    };
    TOKENS = new Map([
        ["SERO", {
            symbol: "SERO",
            decimals: 18,
            name: "超零"
        }],
        ["THE_FIRST_PRIVACY_COIN", {
            symbol: "TFPC",
            decimals: 18,
            name: "纪念币"
        }],
        ["ASNOW", {
            symbol: "ASNOW",
            decimals: 18,
            name: "",
            offline: true
        }],
        ["SVVC", {
            symbol: "SVVC",
            decimals: 4,
            name: ""
        }],
        ["NEWBITS", {
            symbol: "NBS",
            decimals: 8,
            name: ""
        }],
        ["NBHBOS", {
            symbol: "NBHBOS",
            decimals: 18,
            name: "牛比特支付"
        }],
        ["VIRTUE", {
            symbol: "VRT",
            decimals: 18,
            name: "积德币"
        }],
        ["ORIGO", {
            symbol: "OGO",
            decimals: 18,
            name: ""
        }],
        ["USDS", {
            symbol: "USDS",
            decimals: 18,
            name: "存储币"
        }]
    ])


    getTokens(token) {
        if (token == "SERO") {
            return this.SERO.tokens;
        }
    }

    getKey(token) {
        return this.TOKENS.get(token).key;
    }

    isOffLine(token) {
        return this.TOKENS.get(token).offline;
    }

    getDecimals(token) {
        let decimals = this.TOKENS.get(token).decimals;
        if (!decimals) {
            throw new Error("not find " + token);
        }
        return decimals;
    }

    getName(token) {
        return this.TOKENS.get(token).name;
    }

    getSymbol(token) {
        return this.TOKENS.get(token).symbol;
    }
}

const pairs = new Pairs();
export default pairs;