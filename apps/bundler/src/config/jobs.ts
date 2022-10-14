import { constants } from "@stackupfinance/walletjs";
import { Networks } from "@stackupfinance/config";

type Relay = {
  id: string;
  network: Networks;
  userOperations: Array<constants.userOperations.IUserOperation>;
};

export type Jobs = {
  relay: Relay;
};
