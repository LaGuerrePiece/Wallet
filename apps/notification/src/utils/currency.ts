import { ethers, BigNumberish } from "ethers";
import { CurrencySymbols, CurrencyMeta } from "@stackupfinance/config";

const USDCDisplay = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const DECIMAL_PLACES = 6;
const MULTIPLIER = Math.pow(10, DECIMAL_PLACES);

// Return currency value to $DECIMAL_PLACES rounded down
const displayGenericToken = (value: BigNumberish, symbol: CurrencySymbols) => {
  return `${ethers.utils.commify(
    (
      Math.floor(
        parseFloat(
          ethers.utils.formatUnits(
            ethers.BigNumber.from(value),
            CurrencyMeta[symbol].decimals
          )
        ) * MULTIPLIER
      ) / MULTIPLIER
    ).toFixed(DECIMAL_PLACES)
  )} ${symbol}`;
};

export const formatCurrency = (
  value: BigNumberish,
  symbol: CurrencySymbols
): string => {
  switch (symbol) {
    case "USDC":
      return USDCDisplay.format(
        parseFloat(
          ethers.utils.formatUnits(
            ethers.BigNumber.from(value),
            CurrencyMeta[symbol].decimals
          )
        )
      );

    default:
      return displayGenericToken(value, symbol);
  }
};
