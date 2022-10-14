import axios from "axios";
import { CurrencyMeta, Networks } from "@stackupfinance/config";
import {
  Env,
  AlchemyNetworkMap,
  AlchemyReverseNetworkMap,
  AlchemyAddressActivityEvent,
  NotificationMessageData,
} from "../config";
import { formatCurrency } from "../utils";
import { IActivityWebhook } from "../models/activitywebhook.model";

interface CreateWebhookResponse {
  data: {
    id: string;
  };
}

export const createWebhooksForNetworks = async (
  walletAddress: string,
  networks: Array<Networks>
): Promise<Array<IActivityWebhook>> => {
  return Promise.all(
    networks.map((network) =>
      axios
        .post<CreateWebhookResponse>(
          "https://dashboard.alchemyapi.io/api/create-webhook",
          {
            network: AlchemyNetworkMap[network],
            webhook_type: "ADDRESS_ACTIVITY",
            webhook_url: `${Env.WEBHOOK_URL}/v1/webhook/alchemy-activity`,
            addresses: [walletAddress],
          },
          { headers: { "X-Alchemy-Token": Env.ALCHEMY_AUTH_TOKEN } }
        )
        .then((response) => ({
          walletAddress,
          alchemyWebhookId: response.data.data.id,
          network,
        }))
    )
  );
};

export const addressActivityToNotificationMessageData = ({
  event,
}: AlchemyAddressActivityEvent): NotificationMessageData => {
  const network = event.network;
  const activity = event.activity[0];

  return {
    channelId: "activity",
    title: `Received ${CurrencyMeta[activity.asset].name}`,
    description: `${formatCurrency(
      activity.rawContract.rawValue,
      activity.asset
    )} sent to your wallet on ${AlchemyReverseNetworkMap[network]}`,
  };
};
