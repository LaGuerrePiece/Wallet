import dotenv from "dotenv";
import { NodeEnvironment, NetworkEnvironment } from "@stackupfinance/config";

dotenv.config();

interface AppEnvironment {
  NODE_ENV: NodeEnvironment;
  NETWORK_ENV: NetworkEnvironment;
  NAME: string;
  PORT: number;
  MONGO_URL: string;
  SENTRY_DSN: string;
  FIREBASE_SERVICE_ACCOUNT: object;
  ALCHEMY_AUTH_TOKEN: string;
  WEBHOOK_URL: string;
  PREFERRED_IP_HEADER: string;
}

export const Env: AppEnvironment = {
  NODE_ENV:
    process.env.NODE_ENV === "production" ? "production" : "development",
  NETWORK_ENV:
    process.env.STACKUP_NOTIFICATION_NETWORK_ENV === "mainnet"
      ? "mainnet"
      : "testnet",
  NAME: "Notification",
  PORT: Number(process.env.STACKUP_NOTIFICATION_PORT),
  MONGO_URL: process.env.STACKUP_NOTIFICATION_MONGODB_URL ?? "",
  SENTRY_DSN: process.env.STACKUP_NOTIFICATION_SENTRY_DSN ?? "",
  FIREBASE_SERVICE_ACCOUNT: JSON.parse(
    process.env.STACKUP_NOTIFICATION_FIREBASE_SERVICE_ACCOUNT ?? "{}"
  ),
  ALCHEMY_AUTH_TOKEN: process.env.STACKUP_NOTIFICATION_ALCHEMY_AUTH_TOKEN ?? "",
  WEBHOOK_URL: process.env.STACKUP_NOTIFICATION_WEBHOOK_URL ?? "",
  PREFERRED_IP_HEADER:
    process.env.STACKUP_NOTIFICATION_PREFERRED_IP_HEADER ?? "",
};
