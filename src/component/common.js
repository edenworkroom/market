import BigNumber from "bignumber.js";

const keccak256 = require("keccak256");
const zeros = "000000000000000000";

function getDate(num) {
    if (num < 10) {
        return "0" + num;
    } else {
        return num;
    }
}

export function formatDate(time) {
    const Y = time.getFullYear();
    const M = getDate(time.getMonth() + 1);
    const d = getDate(time.getDate());
    const h = getDate(time.getHours());
    const m = getDate(time.getMinutes());
    // var s =getDate(time.getSeconds());
    return `${Y}/${M}/${d} ${h}:${m}`;

}

export function showPrice(price) {
    if (price) {
        let ret = new BigNumber(price).dividedBy(new BigNumber(1e18)).toFixed(18);
        return trimNumber(ret, 18);
    } else {
        return "0.000";
    }
}

export function showValueP(val, decimal, decimalPlaces) {
    let num = new BigNumber(val).dividedBy(new BigNumber(10).pow(decimal));
    if (num.comparedTo(1000000) >= 0) {
        let text = num.dividedBy(1000000).toFixed(decimalPlaces);
        return trimNumber(text, decimalPlaces) + "M";
    } else if (num.comparedTo(1000) >= 0) {
        let text = num.dividedBy(1000).toFixed(decimalPlaces);
        return trimNumber(text, decimalPlaces) + "K";
    } else {
        return trimNumber(num.toFixed(decimalPlaces), decimalPlaces);
    }

}

export function showValue(val, decimal, decimalPlaces) {
    let text = new BigNumber(val).dividedBy(new BigNumber(10).pow(decimal)).toFixed(decimalPlaces);
    return trimNumber(text, decimalPlaces)
}

export function showPK(pk, len) {
    if (!pk) {
        return "";
    }
    if (!len) {
        len = 8;
    }
    return pk.slice(0, len) + "..." + pk.slice(-len)
}

export function tokenToBytes(token) {
    let bytes = Buffer.alloc(32);
    bytes.fill(token, 0, token.length);
    return "0x" + bytes.toString('hex');
}

export function hashKey(token1, token2) {
    let data1 = Buffer.alloc(32);
    data1.fill(token1, 0, token1.length);
    let data2 = Buffer.alloc(32);
    data2.fill(token2, 0, token2.length);
    return "0x" + Buffer.from(keccak256(Buffer.concat([data1, data2]))).toString('hex')
}

function trimNumber(numberStr, decimalPlaces) {
    let vals = numberStr.split(".")
    if (vals.length < 2) {
        return numberStr;
    } else {
        let index = -1;
        let decimal = vals[1]
        for (var i = decimal.length - 1; i > 0; i--) {
            if (decimal.charAt(i) != '0') {
                index = i;
                break;
            }
        }
        decimal = decimal.substring(0, index+1);
        let numStr = vals[0];
        if (decimal.length > decimalPlaces) {
            decimal = decimal.substring(0, decimalPlaces);
        }
        if (decimal.length > 0) {
            numStr += "." + decimal;
        }
        return numStr
    }
}
