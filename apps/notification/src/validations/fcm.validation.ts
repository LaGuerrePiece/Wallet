import Joi from "joi";
import { ethereumAddress } from "./custom.validation";

export const post = {
  body: Joi.object().keys({
    previousFcmToken: Joi.string(),
    fcmToken: Joi.string().required(),
    walletAddress: Joi.required().custom(ethereumAddress),
  }),
};

export const remove = {
  query: Joi.object().keys({
    fcmToken: Joi.string().required(),
  }),
};
