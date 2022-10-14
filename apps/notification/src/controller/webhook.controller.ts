import httpStatus from "http-status";
import { ethers } from "ethers";
import { CurrencyList } from "@stackupfinance/config";
import { catchAsync } from "../utils";
import { AlchemyAddressActivityEvent } from "../config";
import * as ActivityWebhookService from "../services/activitywebhook.service";
import * as FCMService from "../services/fcm.service";
import * as FirebaseService from "../services/firebase.service";
import * as AlchemyService from "../services/alchemy.service";

export const alchemyActivity = catchAsync(async (req, res) => {
  const data = req.body as AlchemyAddressActivityEvent;
  const activity = data.event.activity[0];

  const activityWebhook = await ActivityWebhookService.getByWebhookId(
    data.webhookId
  );

  if (
    activityWebhook?.walletAddress ===
      ethers.utils.getAddress(activity.toAddress) &&
    CurrencyList.includes(activity.asset)
  ) {
    const fcmTokens = await FCMService.getLatest10ByWalletAddress(
      activityWebhook.walletAddress
    );

    await FirebaseService.sendMessage(
      fcmTokens.map((fcmToken) => fcmToken.token),
      AlchemyService.addressActivityToNotificationMessageData(data)
    );
  }

  res.status(httpStatus.OK).send();
});
