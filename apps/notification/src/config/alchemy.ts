import { BigNumberish } from "ethers";
import { CurrencySymbols, Networks } from "@stackupfinance/config";
import { Env } from "./env";

type AlchemyNetworks = "MATIC_MAINNET" | "MATIC_MUMBAI";

export interface AlchemyAddressActivityEvent {
  webhookId: string;
  event: {
    network: AlchemyNetworks;
    activity: [
      {
        toAddress: string;
        asset: CurrencySymbols;
        rawContract: {
          rawValue: BigNumberish;
        };
      }
    ];
  };
}

export const AlchemyNetworkMap: Record<Networks, AlchemyNetworks> = {
  Polygon: Env.NETWORK_ENV === "mainnet" ? "MATIC_MAINNET" : "MATIC_MUMBAI",
};

export const AlchemyReverseNetworkMap: Record<AlchemyNetworks, Networks> = {
  MATIC_MAINNET: "Polygon",
  MATIC_MUMBAI: "Polygon",
};

// See https://docs.alchemy.com/reference/notify-api-quickstart#webhook-ip-addresses
export const AlchemyValidIPs = new Set(["54.236.136.17", "34.237.24.169"]);
