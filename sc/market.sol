pragma solidity ^0.4.25;

import "browser/accountInfo.sol";
import "browser/transactionpair.sol";

contract Ownable {

    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

contract SeroInterface {

    bytes32 private topic_sero_issueToken = 0x3be6bf24d822bcd6f6348f6f5a5c2d3108f04991ee63e80cde49a8c4746a0ef3;
    bytes32 private topic_sero_balanceOf = 0xcf19eb4256453a4e30b6a06d651f1970c223fb6bd1826a28ed861f0e602db9b8;
    bytes32 private topic_sero_send = 0x868bd6629e7c2e3d2ccf7b9968fad79b448e7a2bfb3ee20ed1acbc695c3c8b23;
    bytes32 private topic_sero_currency = 0x7c98e64bd943448b4e24ef8c2cdec7b8b1275970cfe10daf2a9bfa4b04dce905;

    function sero_msg_currency() internal returns (string) {
        bytes memory tmp = new bytes(32);
        bytes32 b32;
        assembly {
            log1(tmp, 0x20, sload(topic_sero_currency_slot))
            b32 := mload(tmp)
        }
        return strings.bytes32ToString(b32);
    }

    function sero_issueToken(uint256 _total, string memory _currency) internal returns (bool success){
        bytes memory temp = new bytes(64);
        assembly {
            mstore(temp, _currency)
            mstore(add(temp, 0x20), _total)
            log1(temp, 0x40, sload(topic_sero_issueToken_slot))
            success := mload(add(temp, 0x20))
        }
        return;
    }

    function sero_balanceOf(string memory _currency) internal view returns (uint256 amount){
        bytes memory temp = new bytes(32);
        assembly {
            mstore(temp, _currency)
            log1(temp, 0x20, sload(topic_sero_balanceOf_slot))
            amount := mload(temp)
        }
        return;
    }

    function sero_send_token(address _receiver, string memory _currency, uint256 _amount) internal returns (bool success){
        return sero_send(_receiver, _currency, _amount, "", 0);
    }

    function sero_send(address _receiver, string memory _currency, uint256 _amount, string memory _category, bytes32 _ticket) internal returns (bool success){
        bytes memory temp = new bytes(160);
        assembly {
            mstore(temp, _receiver)
            mstore(add(temp, 0x20), _currency)
            mstore(add(temp, 0x40), _amount)
            mstore(add(temp, 0x60), _category)
            mstore(add(temp, 0x80), _ticket)
            log1(temp, 0xa0, sload(topic_sero_send_slot))
            success := mload(add(temp, 0x80))
        }
        return;
    }
}

contract Market is Ownable, SeroInterface {
    using SafeMath for uint256;
    using AccountInfo for AccountInfo.Accounts;
    using TransactionPair for TransactionPair.Pair;

    string private constant SERO = "SERO";
    bytes32 private SEROBYTES = strings._stringToBytes(SERO);

    AccountInfo.Accounts private accounts;
    mapping(bytes32 => TransactionPair.Pair) private pairs;

    constructor() public {
        accounts = AccountInfo.Accounts({owner : msg.sender});
    }

    function addPair(string tokenStr, string standardStr) public onlyOwner returns (bytes32 key) {
        bytes32 token = strings._stringToBytes(tokenStr);
        bytes32 standard = strings._stringToBytes(standardStr);
        require(token != standard);
        key = keccak256(token, standard);
        TransactionPair.Pair storage pair = pairs[key];
        require(pair.token == 0 && pair.standard == 0);
        pair.initPair(key, token, standard);
    }

    function lastPrice(bytes32[] keys) public view returns (string memory json){
        string[] memory list = new string[](keys.length);
        for (uint i = 0; i < keys.length; i++) {
            bytes32 key = keys[i];
            TransactionPair.Pair storage pair = pairs[key];
            list[i] = JSON.uintToJson(strings.bytes32ToHex(key), pair.lastPrice);
        }
        json = JSON.toJsonMap(list);
    }

    function pairInfo(bytes32 key) public view returns (uint256 price, string buyListJson, string sellListJson) {
        TransactionPair.Pair storage pair = pairs[key];
        return pair.info();
    }

    function orders(bytes32 key) public view returns (string) {
        TransactionPair.Pair storage pair = pairs[key];
        return pair.ordersByIds(accounts.orderList(msg.sender, key));
    }

    function balanceOf(bytes32[] memory tokens) public view returns (string) {
        address self = msg.sender;
        string[] memory list = new string[](tokens.length);
        for (uint i = 0; i < tokens.length; i++) {
            (uint256 v1, uint256 v2) = accounts.balanceOf(self, tokens[i]);
            uint256[] memory vals = new uint256[](2);
            vals[0] = v1;
            vals[1] = v2;
            list[i] = JSON.uintsToJson(strings.bytes32ToJsonString(tokens[i]), vals);
        }
        return JSON.toJsonMap(list);
    }

    function withdraw(string tokenStr, uint256 value) public {
        bytes32 token = strings._stringToBytes(tokenStr);
        (uint256 balance,) = accounts.balanceOf(msg.sender, token);
        require(balance >= value);
        accounts.Sub(msg.sender, token, value);
        require(sero_send_token(msg.sender, tokenStr, value));
    }

    function recharge() public payable {
        bytes32 token = strings._stringToBytes(sero_msg_currency());
        accounts.Add(msg.sender, token, msg.value);
    }

    function cancel(bytes32 key, bytes32[] orderIds) public {
        TransactionPair.Pair storage pair = pairs[key];
        for (uint256 i = 0; i < orderIds.length; i++) {
            pair.cancel(msg.sender, orderIds[i], accounts);
        }
    }

    function buy(bytes32 key, uint256 price, uint256 value) public {
        require(price != 0);
        TransactionPair.Pair storage pair = pairs[key];
        require(pair.token != 0 && pair.standard != 0);

        uint256 amount = price.mul(value).div(1000);
        (uint256 balance,) = accounts.balanceOf(msg.sender, pair.standard);
        require(balance >= amount, "balance not enough");
        pair.buy(msg.sender, price, value, accounts);
    }

    function sell(bytes32 key, uint256 price, uint256 value) public {
        require(price != 0);
        TransactionPair.Pair storage pair = pairs[key];
        require(pair.token != 0 && pair.standard != 0);

        (uint256 balance,) = accounts.balanceOf(msg.sender, pair.token);
        require(balance >= value, "balance not enough");
        pair.sell(msg.sender, price, value, accounts);
    }
}
