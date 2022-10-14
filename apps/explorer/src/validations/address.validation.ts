import Joi from "joi";
import {
  CurrencyList,
  ValidDefaultCurrenies,
  NetworksList,
} from "@stackupfinance/config";
import { ethereumAddress } from "./custom.validation";
import { ValidTimePeriods } from "../config";

export const post = {
  params: Joi.object().keys({
    address: Joi.required().custom(ethereumAddress),
  }),
  body: Joi.object().keys({
    quoteCurrency: Joi.string()
      .valid(...ValidDefaultCurrenies)
      .required(),
    network: Joi.string()
      .valid(...NetworksList)
      .required(),
    timePeriod: Joi.string()
      .valid(...ValidTimePeriods)
      .required(),
    currencies: Joi.array()
      .items(Joi.string().valid(...CurrencyList))
      .unique()
      .required()
      .min(1)
      .max(10),
  }),
};

export const getActivity = {
  params: Joi.object().keys({
    address: Joi.required().custom(ethereumAddress),
  }),
  query: Joi.object().keys({
    network: Joi.string()
      .valid(...NetworksList)
      .required(),
    page: Joi.number().min(1).required(),
  }),
};

export const getGuardians = {
  params: Joi.object().keys({
    address: Joi.required().custom(ethereumAddress),
  }),
  query: Joi.object().keys({
    network: Joi.string()
      .valid(...NetworksList)
      .required(),
  }),
};
