import { ethers } from "ethers";
import * as Wallet from "../contracts/wallet";

export const getGuardians = async (
  provider: ethers.providers.Provider,
  walletAddress: string
) => {
  const w = Wallet.getInstance(provider).attach(walletAddress);
  const guardianCount = await w.getGuardiansCount();
  return Promise.all(
    new Array(guardianCount.toNumber()).fill("").map((_, i) => w.getGuardian(i))
  );
};
