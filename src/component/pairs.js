class Pairs {

    SERO = {
        symbol: "SERO",
        decimals: 18,
        tokens: ["TTTT"]
    };
    TOKENS = new Map([
        ["SERO", {
            symbol: "SERO",
            decimals: 18,
        }],
        ["TTTT", {
            symbol: "TTTT",
            decimals: 18,
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

    getSymbol(token) {
        return this.TOKENS.get(token).symbol;
    }
}

const pairs = new Pairs();
export default pairs;