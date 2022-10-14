---
sidebar_position: 3
---

# Handlers

Functions for handling paymaster business logic.

The ERC-4337 spec is very flexible in terms of how we implement paymasters within our apps. However, regardless of the implementation, the three things all paymasters have to do is:

1. Approve a `UserOperation`
2. Manage it's stake on the `EntryPoint`
3. Manage it's own assets

The framework will generate boilerplate handlers for certain functions. We can program these handlers to give us maximum flexibility in how we build the fee logic in our apps.

## Sign

A big benefit of account abstraction is that it is agnostic to any signature scheme. This handler allows us to take the private key from our configuration and implement the logic to sign a given message.

**`handlers/sign.ts`**

```typescript
import { createSign } from "@PackageName";

export default createSign((privateKey) => {
  return async (message) => {
    /**
     * Logic signing message with configured private key
     *
     * @param message: BytesLike message to be signed
     * @returns Promise<BytesLike>
     */

    return "0x";
  };
});
```

## Sponsor

The rules for sponsoring a given `UserOperation` is dependant on your app. This handler allows you to implement any logic for [eth_sponsorUserOperation](./rpc-methods.md#ethsponsoruseroperation).

**`handlers/sponsor.ts`**

```typescript
import { sponsorHandler } from "@PackageName";

export default sponsorHandler<T>(async (userOperation, config) => {
  /**
   * Logic for parsing a UserOperation requesting to be sponsored
   * If approve, return extra data to be encoded in the paymasterAndData
   * If rejected, throw error with a message
   *
   * @param userOperation: UserOperation from request
   * @param config: Paymaster configuration
   * @returns Promise<T>
   */

  return;
});
```

## Execute

A paymaster is required to send transactions of it's own. The framework assumes that Paymaster is also an ERC-4337 wallet. This handler is called by all [scripts](./scripts.md) and can be used to make final adjustments to the `UserOperation`.

**`handlers/execute.ts`**

```typescript
import { executeHandler } from "@PackageName";

export default executeHandler(async (userOperation, config) => {
  /**
   * Logic for adjusting UserOperation built for scripts
   * The signature field will be the signed `requestId` using handlers/sign.ts
   * If no adjustments are required, this file can remain as is.
   *
   * @param userOperation: Transaction to execute
   * @param config: Paymaster configuration
   * @returns Promise<UserOperation>
   */

  return userOperation;
});
```
