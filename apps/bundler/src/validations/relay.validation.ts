import Joi from "joi";
import { NetworksList } from "@stackupfinance/config";
import UserOperationSchema from "./schemas/useroperations";

export const submit = {
  body: Joi.object().keys({
    network: Joi.string()
      .valid(...NetworksList)
      .required(),
    userOperations: Joi.array().items(UserOperationSchema).required().min(1),
  }),
};
