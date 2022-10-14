// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

library EnumerableSet {
  struct AddressSet {
    uint256 _size;
    uint256 _length;
    address[] _values;
  }

  function init(uint256 n) internal pure returns (AddressSet memory set) {
    set._size = n;
    set._length = 0;
    set._values = new address[](n);
  }

  function length(AddressSet memory set) internal pure returns (uint256) {
    return set._length;
  }

  function size(AddressSet memory set) internal pure returns (uint256) {
    return set._size;
  }

  function isFull(AddressSet memory set) internal pure returns (bool) {
    return set._length == set._size;
  }

  function add(AddressSet memory set, address value) internal pure returns (bool) {
    require(!isFull(set), "ERROR_SET_FULL");
    if (includes(set, value)) return false;
    uint256 index = length(set);
    set._length++;
    set._values[index] = value;
    return true;
  }

  function includes(AddressSet memory set, address value) internal pure returns (bool) {
    for (uint256 i = 0; i < length(set); i++) {
      if (set._values[i] == value) {
        return true;
      }
    }
    return false;
  }
}
