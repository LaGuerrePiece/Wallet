import { BigNumberish } from "ethers";
export declare type CurrencySymbols = "USDC" | "ETH" | "MATIC" | "BTC";
export declare type CurrencyCategories = "Stablecoins" | "Cryptocurrency";
export declare type CurrencyBalances = Partial<Record<CurrencySymbols, BigNumberish>>;
declare type CurrencyMeta = {
    name: string;
    displaySymbol: string;
    decimals: number;
    category: CurrencyCategories;
    externalLink?: string;
};
export declare const CurrencyList: Array<CurrencySymbols>;
export declare const CurrencyCategoryList: Array<CurrencyCategories>;
export declare const ValidDefaultCurrenies: Array<CurrencySymbols>;
export declare const CurrencyMeta: Record<CurrencySymbols, CurrencyMeta>;
export {};
