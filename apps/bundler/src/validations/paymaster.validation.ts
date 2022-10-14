import Joi from "joi";
import { NetworksList } from "@stackupfinance/config";
import UserOperationSchema from "./schemas/useroperations";
import { ethereumAddress } from "./custom.validation";

export const sign = {
  body: Joi.object().keys({
    network: Joi.string()
      .valid(...NetworksList)
      .required(),
    userOperations: Joi.array().items(UserOperationSchema).required().min(1),
  }),
};

export const status = {
  query: Joi.object().keys({
    address: Joi.required().custom(ethereumAddress),
    network: Joi.string()
      .valid(...NetworksList)
      .required(),
  }),
};
