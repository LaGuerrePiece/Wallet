"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyMeta = exports.ValidDefaultCurrenies = exports.CurrencyCategoryList = exports.CurrencyList = void 0;
exports.CurrencyList = [
    "USDC",
    "ETH",
    "MATIC",
    "BTC",
];
exports.CurrencyCategoryList = [
    "Stablecoins",
    "Cryptocurrency",
];
exports.ValidDefaultCurrenies = ["USDC"];
exports.CurrencyMeta = {
    USDC: {
        name: "USDC (USD)",
        displaySymbol: "USDC",
        decimals: 6,
        category: "Stablecoins",
        externalLink: "https://www.stackup.sh/learn/usdc",
    },
    ETH: {
        name: "Ethereum",
        displaySymbol: "ETH",
        decimals: 18,
        category: "Cryptocurrency",
        externalLink: "https://www.stackup.sh/learn/eth",
    },
    MATIC: {
        name: "Matic",
        displaySymbol: "MATIC",
        decimals: 18,
        category: "Cryptocurrency",
        externalLink: "https://www.stackup.sh/learn/matic",
    },
    BTC: {
        name: "Bitcoin",
        displaySymbol: "BTC",
        decimals: 8,
        category: "Cryptocurrency",
        externalLink: "https://www.stackup.sh/learn/btc",
    },
};
