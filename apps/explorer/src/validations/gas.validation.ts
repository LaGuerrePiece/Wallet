import Joi from "joi";
import { NetworksList } from "@stackupfinance/config";

export const estimator = {
  query: Joi.object().keys({
    network: Joi.string()
      .valid(...NetworksList)
      .required(),
  }),
};
