pragma solidity ^0.4.25;

import "browser/common.sol";

library AccountInfo {
    using SafeMath for uint256;

    struct Balance {
        mapping(bytes32 => uint256) values;
        mapping(bytes32 => uint256) lockdValues;
    }

    struct Accounts {
        address owner;
        mapping(address => Balance) balances;
        mapping(address => mapping(bytes32 => bytes32[])) orders; //address => key => orderid
    }

    function add(Accounts storage self, bytes32 token, uint256 value) internal {
        self.balances[self.owner].values[token] = self.books[self.owner].values[token].add(value);
    }

    function sub(Accounts storage self, bytes32 token, uint256 value) internal {
        self.balances[self.owner].values[token] = self.books[self.owner].values[token].sub(value);
    }

    function Lock(Accounts storage self, address addr, bytes32 token, uint256 value) internal {
        require(self.books[addr].values[token].sub(self.balances[addr].lockdValues[token]) >= value);
        self.balances[addr].lockdValues[token] = self.books[addr].lockdValues[token].add(value);
    }

    function UnLock(Accounts storage self, address addr, bytes32 token, uint256 value) internal {
        self.balances[addr].lockdValues[token] = self.books[addr].lockdValues[token].sub(value);
    }

    function Use(Accounts storage self, address addr, bytes32 token, uint256 value) internal {
        self.balances[addr].lockdValues[token] = self.books[addr].lockdValues[token].sub(value);
        self.balances[addr].values[token] = self.books[addr].values[token].sub(value);
    }

    function Add(Accounts storage self, address addr, bytes32 token, uint256 value) internal {
        self.balances[addr].values[token] = self.books[addr].values[token].add(value);
    }

    function Sub(Accounts storage self, address addr, bytes32 token, uint256 value) internal {
        require(self.books[addr].values[token].sub(self.balances[addr].lockdValues[token]) >= value);
        self.balances[addr].values[token] = self.books[addr].values[token].sub(value);
    }

    function balanceOf(Accounts storage self, address addr, bytes32 token) internal view returns (uint256, uint256) {
        return (self.books[addr].values[token].sub(self.balances[addr].lockdValues[token]), self.balances[addr].lockdValues[token]);
    }

    function insertOrder(Accounts storage self, address addr, bytes32 key, bytes32 orderId) internal {
        self.orders[addr][key].push(orderId);
    }

    function orderList(Accounts storage self, address addr, bytes32 key) internal view returns (bytes32[]) {
        return self.orders[addr][key];
    }
}