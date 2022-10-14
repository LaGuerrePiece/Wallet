---
sidebar_position: 1
---

# Account Abstraction

Enabling the use of smart contract wallets over EOAs.

## Contract Accounts vs EOAs

If you've ever interacted with EVM networks, then you'll most likely have used an `EOA` (Externally Owned Account). EOAs are **accounts that are controlled by an external private key**. Only an EOA can trigger transactions on the blockchain and this currently makes it the default model for most users. Many popular wallets like a Ledger device, MetaMask browser extension, or Rainbow mobile app are EOAs.

However, theres also a second type of account, which are `Contract Accounts`. These are **managed by code that live within the EVM as smart contracts**.

The goal of account abstraction is to consolidate these two account types and enable users to only have smart contract wallets without the need of an EOA.

### Why use contract accounts?

If you've ever tried to build Web3 apps with amazing user experiences you'll eventually hit road blocks that are imposed by the limitations of an EOA. In other words, the UX ceiling in terms of what you can achieve with an EOA is not very high. Here are some of the things contract accounts can enable that aren't possible with EOAs:

- **🔑 Arbitrary verification logic**: Support single and multi sig verification and any arbitrary signature scheme.
- **💱 Sponsored transactions**: Allow users to pay transaction fees in ERC-20 tokens or build your own fee logic.
- **🔒 Account security**: Enable social recovery and security features like time-locks and withdraw limits.
- **⚛️ Atomic multi-operations**: Build flows that better align with your user's intent such as trading in one click rather than approving and swapping separately.

Account abstraction sounds great! But there are some down sides to also consider:

- **✍️ Signing issues**: Ideally, all apps would following [EIP-1271](https://eips.ethereum.org/EIPS/eip-1271) to validate signatures. Unfortunately this is not always the case and those apps would be incompatible with contract accounts.
- **⛽️ Higher gas cost**: On L2s and other scaling solutions this becomes less of a problem. However more research on how to reduce gas cost in this context, especially on Ethereum mainnet, is required.

## The state of account abstraction

There have been multiple approaches to account abstraction over the years such as [EIP-86](https://eips.ethereum.org/EIPS/eip-86) and [EIP-2938](https://eips.ethereum.org/EIPS/eip-2938). However these weren't practical to achieve since they required consensus layer changes at a time where core developers are focused mainly on the merge and scalability.

This is where [EIP-4337](https://eips.ethereum.org/EIPS/eip-4337) shines and is currently the best approach for the ecosystem to achieve account abstraction. It proposes a solution that **relies on higher-level infrastructure that avoids the need for consensus layer changes**. This means, unlike past proposals, developers can start building on a universal standard today.

## The challenge for builders

Although contract accounts offer the ability to build much better user experiences, they also introduce more complexity for developers to manage the interaction between different components like the `Bundler`, `EntryPoint`, `Wallet`, and `Paymaster`.

**Stackup creates open source tools that are compliant with any implementation of ERC-4337. This allows developers to have an easier time building apps with account abstraction.**
