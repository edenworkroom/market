import BigNumber from "bignumber.js";

const keccak256 = require("keccak256");


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
    return `${h}:${m} ${Y}/${M}/${d}`;

}

export function showPrice(price, decimalPlaces) {
    if (price) {
        let ret = new BigNumber(price).dividedBy(new BigNumber("1000")).toFixed(decimalPlaces);
        return trimNumber(ret);
    } else {
        return "0.000";
    }
}

export function decimals(val, decimal, decimalPlaces) {
    let text = new BigNumber(val).dividedBy(new BigNumber(10).pow(decimal)).toFixed(decimalPlaces);
    return trimNumber(text)
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

function trimNumber(numberStr) {
    if (numberStr.indexOf(".") > -1 && numberStr.charAt(numberStr.length - 1) == '0') {
        for (var i = numberStr.length - 1; i > 0; i--) {
            if (numberStr.charAt(i) != '0') {
                if (numberStr.charAt(i) == '.') {
                    return numberStr.substring(0, i);
                } else {
                    return numberStr.substring(0, i + 1);
                }
            }
        }
    }
    return numberStr;
}
