import admin from "firebase-admin";
import { Env, NotificationMessageData } from "../config";

admin.initializeApp({
  credential: admin.credential.cert(Env.FIREBASE_SERVICE_ACCOUNT),
});

export const sendMessage = async (
  tokens: Array<string>,
  data: NotificationMessageData
) => {
  return admin.messaging().sendMulticast({ tokens, data });
};
