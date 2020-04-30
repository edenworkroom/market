class Pairs {

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
        ["NBHBOS", {
            symbol: "NBHBOS",
            decimals: 18,
            name: "牛比特支付"
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
        }],
        ["HAPY", {
            symbol: "HAPY",
            decimals: 18,
            name: ""
        }],
        ["AIPP", {
            symbol: "AIPP",
            decimals: 18,
            name: ""
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
        ["VIRTUE", {
            symbol: "VRT",
            decimals: 18,
            name: "积德币"
        }],
        ["TTTT", {
            symbol: "TTTT",
            decimals: 18,
            name: "test"
        }]
    ])

    // getInfo(token) {
    //     return this.TOKENS.get(token)
    // }
}

const pairs = new Pairs();
export default pairs;