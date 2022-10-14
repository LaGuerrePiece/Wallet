import { CurrencySymbols } from "@stackupfinance/config";

type FetchQuotes = {
  quoteCurrency: CurrencySymbols;
  attempt: number;
};

export type Jobs = {
  fetchQuotes: FetchQuotes;
};
