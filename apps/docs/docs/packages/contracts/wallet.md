---
sidebar_position: 4
---

# Wallet

Solidity components for ERC-4337 Wallets.

The easiest way to use the `Wallet` libraries is to compose your smart contracts with one `Base` and a combination of `Extensions` that fit your use case.

The `Base` implements the core interface of an ERC-4337 wallet with a specific type of verification logic. The `Extensions` build on top of your `Base` to add common wallet functions.

:::info

If none of the implementations fit your use case, come chat with us on [Discord](https://discord.gg/FpXmvKrNed) or [E-mail](mailto:founders@stackup.sh) about getting it built!

Alternatively, the package also exports the minimum interface required to build your own `Wallet` that is compliant with the spec.

:::

---

## Minimum viable interface

The minimum interface that must be implemented in order to be a compliant ERC-4337 wallet.

```solidity
import @PackageName/contracts/ERC4337/wallet/IERC4337Wallet.sol;
```

```solidity
interface IERC4337Wallet {
  function validateUserOp(
    UserOperation calldata op,
    bytes32 requestId,
    uint256 missingWalletFunds
  ) external;
}

```

The `validateUserOp` function is what get's called by the `EntryPoint` during the [verification phase](../../introduction/erc-4337-overview.md#entrypoint). It has the following arguments:

- [`UserOperation`](./useroperation.md)
- `requestId`: Hash of `UserOperation`, `EntryPoint` address, and `chainId`
- `missingWalletFunds`: Max amount of wei that must be sent to the `EntryPoint` to cover gas fees. Any unused gas is refunded from this amount.

---

## Base

Base implementations of an ERC-4337 wallet. **Use one that matches the verification method you require.**

:::info

All `Base` implementations are also compatible with [ERC-1271](../../guides/validating-signatures.md#a-standard-to-ensure-interoperability) for signature validation and [UUPSUpgradeable](https://docs.openzeppelin.com/contracts/4.x/api/proxy#UUPSUpgradeable) for upgrading proxies.

:::

:::tip

These implementations will also encode signatures in specific ways depending on the scheme used. See the [`UserOperation` signature guide](../../guides/useroperation-signatures.md) for more details.

:::

### `BaseEOAOwner`

Uses a single EOA as the owner. The current owner can initiate a transfer of ownership to a new EOA.

```solidity
import @PackageName/contracts/ERC4337/wallet/BaseEOAOwner.sol;
```

```solidity
contract Wallet is BaseEOAOwner {
  constructor(address entryPoint) BaseEOAOwner(entryPoint) {}
}

```

#### Functions

Used to initialize a Proxy. Can only be called once.

```solidity
function initialize(address owner) external initializer;

```

Read only function for returning the address of the current owner.

```solidity
function getOwner() external view returns (address);

```

External function for transferring ownership to a new `EOA` address.

```solidity
function transferOwner(address account) external authenticate;

```

Internal function to validate if a hash was signed by the current owner.

```solidity
function _validateSignature(
  address signer,
  bytes32 hash,
  bytes memory signature
) internal view;

```

#### Signatures

`BaseEOAOwner` will use `ecrecover` to return the address that signed the `hash` to produce the `signature`. This address is then checked against the current owner for verification.

### `BaseEOAOwnerAndGuardians`

:::caution

**🚧 This `Base` is still TBD.**

:::

<!-- Uses a single EOA as the owner and N number of other EOAs as guardians. Transfer of ownership can be initiated either by the current owner or majority consensus from guardians. -->

### `BaseEOAMultisig`

:::caution

**🚧 This `Base` is still TBD.**

:::

<!-- Uses N number of EOAs as the owner. Any action requires majority consensus from owners. -->

---

## Extensions

Although these are not part of the ERC-4337 spec, they may still be useful in building out your specific use cases.

You can replace `WithExtensionName` for any of the importable extensions below. Any one [`Base`](#base) can also be paired with multiple `Extensions`.

```solidity
contract Wallet is BaseEOAOwner, WithExtensionName {
  constructor(address entryPoint) BaseEOAOwner(entryPoint) {}
}

```

### `WithReceive`

Enables wallet to receive ETH transfers.

```solidity
import @PackageName/contracts/ERC4337/wallet/WithReceive.sol
```

#### Functions

```solidity
receive() external payable;

```

### `WithExecute`

Enables wallet to send internal transactions to any address.

```solidity
import @PackageName/contracts/ERC4337/wallet/WithExecute.sol
```

#### Functions

```solidity
function execute(
  address to,
  uint256 value,
  bytes calldata data
) external authenticate;

```

### `WithExecuteBatch`

Similar to [`WithExecute`](#withexecute) but with the added function of executing an array of internal transactions. This allows a wallet to support atomic multi-operations.

```solidity
import @PackageName/contracts/ERC4337/wallet/WithExecuteBatch.sol
```

#### Functions

```solidity
function executeBatch(InternalTransaction[] calldata transactions)
  external
  authenticate;

```

#### Types

```solidity
struct InternalTransaction {
  address to;
  uint256 value;
  bytes data;
}

```
