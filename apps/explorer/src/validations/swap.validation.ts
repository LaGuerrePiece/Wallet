import Joi from "joi";
import { CurrencyList, NetworksList } from "@stackupfinance/config";
import { bigNumber, ethereumAddress } from "./custom.validation";

export const quote = {
  query: Joi.object().keys({
    network: Joi.string()
      .valid(...NetworksList)
      .required(),
    baseCurrency: Joi.string()
      .valid(...CurrencyList)
      .required(),
    quoteCurrency: Joi.string()
      .valid(...CurrencyList)
      .required(),
    value: Joi.required().custom(bigNumber),
    address: Joi.required().custom(ethereumAddress),
  }),
};
