import express from "express";
import { validate } from "../../middlewares";
import * as fcmValidation from "../../validations/fcm.validation";
import * as fcmController from "../../controller/fcm.controller";

const router = express.Router();

router
  .route("/token")
  .post(validate(fcmValidation.post), fcmController.post)
  .delete(validate(fcmValidation.remove), fcmController.remove);

export default router;
