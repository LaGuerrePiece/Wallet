import { ethers } from "ethers";
import { Token, WETH9 } from "@uniswap/sdk-core";
import {
  CurrencyMeta,
  NetworksList,
  initNetworksConfig,
} from "@stackupfinance/config";
import { Env } from "./env";

export const NetworksConfig = initNetworksConfig({
  networkEnv: Env.NETWORK_ENV,
  polygonScanAPIKey: Env.POLYGONSCAN_API_KEY,
});

const populateWETH9 = () => {
  NetworksList.forEach((network) => {
    const chainId = ethers.BigNumber.from(
      NetworksConfig[network].chainId
    ).toNumber();

    WETH9[chainId] = new Token(
      chainId,
      NetworksConfig[network].wrappedNativeCurrency,
      CurrencyMeta[NetworksConfig[network].nativeCurrency].decimals,
      NetworksConfig[network].nativeCurrency,
      NetworksConfig[network].nativeCurrency
    );
  });
};
populateWETH9();
