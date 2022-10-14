import express from "express";
import { validateAlchemyIP } from "../../middlewares";
import * as WebhookController from "../../controller/webhook.controller";

const router = express.Router();

router
  .route("/alchemy-activity")
  .post(validateAlchemyIP, WebhookController.alchemyActivity);

export default router;
