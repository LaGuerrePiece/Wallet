---
sidebar_position: 1
---

# Installation

A guide to spinning up an RPC client to handle ops.

This package is a Go implementation of an ERC-4337 `Bundler`. The current version supports a private mempool with a P2P version on the road map.

This package is open source at [github.com/stackup-wallet/stackup-bundler](https://github.com/stackup-wallet/stackup-bundler).

:::tip

**Require a fully managed instance for your project?**

Come chat with us on [Discord](https://discord.gg/FpXmvKrNed) or [E-mail](mailto:founders@stackup.sh) to get set up ASAP! 🚀

:::

:::caution

**🛠 This package is under active development**

In the meantime, feel free the to read the docs and give us your feedback on [Discord](https://discord.gg/FpXmvKrNed)! 💬

:::

## Via `go install`

Make sure to have your environment variables configured before running the client. See the [configuration page](./configuration.md) for details.

```bash
go install github.com/stackup-wallet/stackup-bundler@latest

# Configure env vars before running the bundler
stackup-bundler
```
