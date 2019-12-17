class Pairs {

    SERO = {
        symbol: "SERO",
        decimals: 18,
        tokens: ["THE_FIRST_PRIVACY_COIN", "TTTT", "FFFF"]
    };
    TOKENS = new Map([
        ["SERO", {
            symbol: "SERO",
            decimals: 18,
            name:"超零"
        }],
        ["THE_FIRST_PRIVACY_COIN", {
            symbol: "TFPC",
            decimals: 18,
            name:"记念币"
        }],
        ["TTTT", {
            symbol: "TTTT",
            decimals: 18,
            name:"测试币"
        }],
        ["FFFF", {
            symbol: "FFFF",
            decimals: 9,
            name:"测试币"
        }],
    ])


    getTokens(token) {
        if (token == "SERO") {
            return this.SERO.tokens;
        }
    }

    getKey(token) {
        return this.TOKENS.get(token).key;
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