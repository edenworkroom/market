class Pairs {

    SERO = {
        symbol: "SERO",
        decimals: 18,
        tokens: ["THE_FIRST_PRIVACY_COIN"]
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
            name:"纪念币"
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