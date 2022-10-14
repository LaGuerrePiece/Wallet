import { Schema, model } from "mongoose";
import toJSON from "@meanie/mongoose-to-json";
import { Networks } from "@stackupfinance/config";

export interface IActivityWebhook {
  walletAddress: string;
  alchemyWebhookId: string;
  network: Networks;
}

const schema = new Schema<IActivityWebhook>(
  {
    walletAddress: { type: String, required: true, index: true },
    alchemyWebhookId: { type: String, required: true, unique: true },
    network: { type: String, required: true },
  },
  { timestamps: true }
);

schema.index({ updatedAt: 1 });
schema.plugin(toJSON);

export default model("activitywebhook", schema);
