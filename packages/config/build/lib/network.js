"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initNetworksConfig = exports.NetworksList = exports.DefaultNetwork = void 0;
const ethers_1 = require("ethers");
exports.DefaultNetwork = "Polygon";
exports.NetworksList = ["Polygon"];
const initNetworksConfig = ({ networkEnv, polygonScanAPIKey = "", }) => {
    return {
        Polygon: {
            name: "Polygon",
            color: "#6561ff",
            nativeCurrency: "MATIC",
            wrappedNativeCurrency: networkEnv === "mainnet"
                ? "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
                : "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
            chainId: networkEnv === "mainnet" ? "137" : "80001",
            mainnetChainId: "137",
            uniswapV3Router: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
            etherScanUrl: networkEnv === "mainnet"
                ? `https://api.polygonscan.com/api?apikey=${polygonScanAPIKey}`
                : `https://api-testnet.polygonscan.com/api?apikey=${polygonScanAPIKey}`,
            currencies: {
                MATIC: {
                    address: ethers_1.ethers.constants.AddressZero,
                    priceFeed: ethers_1.ethers.constants.AddressZero,
                },
                USDC: {
                    address: networkEnv === "mainnet"
                        ? "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
                        : "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e",
                    priceFeed: networkEnv === "mainnet"
                        ? "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0"
                        : "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada",
                },
                ETH: {
                    address: networkEnv === "mainnet"
                        ? "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
                        : "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa",
                    priceFeed: networkEnv === "mainnet"
                        ? "0x327e23A4855b6F663a28c5161541d69Af8973302"
                        : "0x327e23A4855b6F663a28c5161541d69Af8973302",
                },
                BTC: {
                    address: networkEnv === "mainnet"
                        ? "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6"
                        : "0x0d787a4a1548f673ed375445535a6c7A1EE56180",
                    // No chainlink price feed for MATIC / BTC on Polygon
                    priceFeed: ethers_1.ethers.constants.AddressZero,
                },
            },
        },
    };
};
exports.initNetworksConfig = initNetworksConfig;
