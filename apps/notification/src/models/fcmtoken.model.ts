import { Schema, model } from "mongoose";
import toJSON from "@meanie/mongoose-to-json";

export interface IFCMToken {
  token: string;
  walletAddress: string;
}

const schema = new Schema<IFCMToken>(
  {
    token: { type: String, required: true, unique: true },
    walletAddress: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

schema.index({ updatedAt: 1 });
schema.plugin(toJSON);

export default model("fcmtoken", schema);
