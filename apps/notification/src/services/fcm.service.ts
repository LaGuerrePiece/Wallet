import FCMToken from "../models/fcmtoken.model";

export const update = async (
  walletAddress: string,
  token: string,
  previousToken?: string
) => {
  return FCMToken.findOneAndUpdate(
    { token: previousToken ?? token },
    { token, walletAddress },
    { upsert: true }
  );
};

export const remove = async (token: string) => {
  return FCMToken.deleteOne({ token });
};

export const getLatest10ByWalletAddress = async (walletAddress: string) => {
  return FCMToken.find({ walletAddress }).sort({ updatedAt: "desc" }).limit(10);
};
