import httpStatus from "http-status";
import { catchAsync } from "../utils";
import * as FCMService from "../services/fcm.service";
import * as ActivityWebhookService from "../services/activitywebhook.service";
import * as AlchemyService from "../services/alchemy.service";

export const post = catchAsync(async (req, res) => {
  const { previousFcmToken, fcmToken, walletAddress } = req.body as {
    previousFcmToken?: string;
    fcmToken: string;
    walletAddress: string;
  };

  await ActivityWebhookService.saveWebhooks(
    await AlchemyService.createWebhooksForNetworks(
      walletAddress,
      await ActivityWebhookService.getMissingWebhookForNetworks(walletAddress)
    )
  );
  await FCMService.update(walletAddress, fcmToken, previousFcmToken);
  res.status(httpStatus.NO_CONTENT).send();
});

export const remove = catchAsync(async (req, res) => {
  const { fcmToken } = req.query as { fcmToken: string };

  await FCMService.remove(fcmToken);
  res.status(httpStatus.NO_CONTENT).send();
});
