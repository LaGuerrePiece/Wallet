// proxy.sol - execute actions atomically through the proxy's identity

// Copyright (C) 2017  DappHub, LLC

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

pragma solidity 0.8.17;

import "./auth.sol";
import "./note.sol";

// DSProxy
// Allows code execution using a persistant identity This can be very
// useful to execute a sequence of atomic actions. Since the owner of
// the proxy can be changed, this allows for dynamic ownership models
// i.e. a multisig
contract DSProxy is DSAuth, DSNote, IWallet, UpgradeableACL, Paymaster {
    DSProxyCache public cache;  // global cache for contracts

    using ECDSA for bytes32;
    using Calls for address;
    using Calls for address payable;
    using Signatures for UserOperation;
    using WalletHelpers for UserOperation;
    using EnumerableSet for EnumerableSet.AddressSet;

    // Wallet's nonce
    uint256 public nonce;

    constructor(address _cacheAddr) Paymaster(entryPoint) public {
        setCache(_cacheAddr);
    }

    function() external payable {
    }

    // use the proxy to execute calldata _data on contract _code
    function execute(bytes memory _code, bytes memory _data)
        public
        payable
        returns (address target, bytes memory response)
    {
        target = cache.read(_code);
        if (target == address(0)) {
            // deploy contract & store its address in cache
            target = cache.write(_code);
        }

        response = execute(target, _data);
    }

    function execute(address _target, bytes memory _data)
        public
        auth
        note
        payable
        returns (bytes memory response)
    {
        require(_target != address(0), "ds-proxy-target-address-required");

        // call contract in current context
        assembly {
            let succeeded := delegatecall(sub(gas, 5000), _target, add(_data, 0x20), mload(_data), 0, 0)
            let size := returndatasize

            response := mload(0x40)
            mstore(0x40, add(response, and(add(add(size, 0x20), 0x1f), not(0x1f))))
            mstore(response, size)
            returndatacopy(add(response, 0x20), 0, size)

            switch iszero(succeeded)
            case 1 {
                // throw if delegatecall failed
                revert(add(response, 0x20), size)
            }
        }
    }

    //set new cache
    function setCache(address _cacheAddr)
        public
        auth
        note
        returns (bool)
    {
        require(_cacheAddr != address(0), "ds-proxy-cache-address-required");
        cache = DSProxyCache(_cacheAddr);  // overwrite cache
        return true;
    }

    function executeUserOp(
    address to,
    uint256 value,
    bytes calldata data
  ) external override authenticate {
    execute{value: value}(to, data);
    // to.callWithValue(data, value, "Wallet: Execution failed");
  }

  /**
   * @dev Verifies the operation’s signature, and pays the fee if the wallet considers the operation valid
   * @param op operation to be validated
   * @param requestId identifier computed as keccak256(op, entryPoint, chainId)
   * @param requiredPrefund amount to be paid to the entry point in wei, or zero if there is a paymaster involved
   */
  function validateUserOp(
    UserOperation calldata op,
    bytes32 requestId,
    uint256 requiredPrefund
  ) external override authenticate {
    require(nonce++ == op.nonce, "Wallet: Invalid nonce");

    SignatureData memory signatureData = op.decodeSignature();
    signatureData.mode == SignatureMode.owner
      ? _validateOwnerSignature(signatureData, requestId)
      : _validateGuardiansSignature(signatureData, op, requestId);

    if (requiredPrefund > 0) {
      payable(entryPoint).sendValue(requiredPrefund, "Wallet: Failed to prefund");
    }
  }

  /**
   * @dev Internal function to validate an owner's signature
   */
  function _validateOwnerSignature(SignatureData memory signatureData, bytes32 requestId) internal view {
    SignatureValue memory value = signatureData.values[0];
    _validateOwnerSignature(value.signer, requestId.toEthSignedMessageHash(), value.signature);
  }

  /**
   * @dev Internal function to validate guardians signatures
   */
  function _validateGuardiansSignature(
    SignatureData memory signatureData,
    UserOperation calldata op,
    bytes32 requestId
  ) internal view {
    require(getGuardiansCount() > 0, "Wallet: No guardians allowed");
    require(op.isGuardianActionAllowed(), "Wallet: Invalid guardian action");

    EnumerableSet.AddressSet memory uniqueSignatures = EnumerableSet.init(signatureData.values.length);
    for (uint256 i = 0; i < signatureData.values.length; i++) {
      SignatureValue memory value = signatureData.values[i];
      _validateGuardianSignature(value.signer, requestId.toEthSignedMessageHash(), value.signature);
      uniqueSignatures.add(value.signer);
    }

    require(uniqueSignatures.length() >= getMinGuardiansSignatures(), "Wallet: Insufficient guardians");
  }
}

// DSProxyFactory
// This factory deploys new proxy instances through build()
// Deployed proxy addresses are logged
contract DSProxyFactory {
    event Created(address indexed sender, address indexed owner, address proxy, address cache);
    mapping(address=>bool) public isProxy;
    DSProxyCache public cache;

    constructor() public {
        cache = new DSProxyCache();
    }

    // deploys a new proxy instance
    // sets owner of proxy to caller
    function build() public returns (address payable proxy) {
        proxy = build(msg.sender);
    }

    // deploys a new proxy instance
    // sets custom owner of proxy
    function build(address owner) public returns (address payable proxy) {
        proxy = address(new DSProxy(address(cache)));
        emit Created(msg.sender, owner, address(proxy), address(cache));
        DSProxy(proxy).setOwner(owner);
        isProxy[proxy] = true;
    }
}

// DSProxyCache
// This global cache stores addresses of contracts previously deployed
// by a proxy. This saves gas from repeat deployment of the same
// contracts and eliminates blockchain bloat.

// By default, all proxies deployed from the same factory store
// contracts in the same cache. The cache a proxy instance uses can be
// changed.  The cache uses the sha3 hash of a contract's bytecode to
// lookup the address
contract DSProxyCache {
    mapping(bytes32 => address) cache;

    function read(bytes memory _code) public view returns (address) {
        bytes32 hash = keccak256(_code);
        return cache[hash];
    }

    function write(bytes memory _code) public returns (address target) {
        assembly {
            target := create(0, add(_code, 0x20), mload(_code))
            switch iszero(extcodesize(target))
            case 1 {
                // throw if contract failed to deploy
                revert(0, 0)
            }
        }
        bytes32 hash = keccak256(_code);
        cache[hash] = target;
    }
}
