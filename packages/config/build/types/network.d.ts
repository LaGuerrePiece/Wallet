import { BigNumberish } from "ethers";
import { CurrencySymbols } from "./currency";
import { NetworkEnvironment } from "./env";
export declare type Networks = "Polygon";
interface CurrenciesConfig {
    address: string;
    priceFeed: string;
}
interface NetworksConfigParams {
    networkEnv: NetworkEnvironment;
    polygonScanAPIKey?: string;
}
interface NetworksConfig {
    name: string;
    color: string;
    nativeCurrency: CurrencySymbols;
    wrappedNativeCurrency: string;
    chainId: BigNumberish;
    mainnetChainId: BigNumberish;
    uniswapV3Router: string;
    etherScanUrl: string;
    currencies: Record<CurrencySymbols, CurrenciesConfig>;
}
export declare const DefaultNetwork: Networks;
export declare const NetworksList: Array<Networks>;
export declare const initNetworksConfig: ({ networkEnv, polygonScanAPIKey, }: NetworksConfigParams) => Record<Networks, NetworksConfig>;
export {};
