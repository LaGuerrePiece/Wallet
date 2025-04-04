import httpStatus from "http-status";
import { constants } from "@stackupfinance/walletjs";
import { CurrencyBalances, Networks } from "@stackupfinance/config";
import { ApiError, catchAsync } from "../utils";
import { Env, DefaultFees } from "../config";
import * as AlchemyService from "../services/alchemy.service";
import * as PaymasterService from "../services/paymaster.service";

interface SignReqestBody {
  network: Networks;
  userOperations: Array<constants.userOperations.IUserOperation>;
}

interface SignResponse {
  userOperations: Array<constants.userOperations.IUserOperation>;
}

interface StatusResponse {
  address: string;
  fees: CurrencyBalances;
  allowances: CurrencyBalances;
}

export const sign = catchAsync(async (req, res) => {
  const { network, userOperations } = req.body as SignReqestBody;

  const [balance, allowance] = await Promise.all([
    AlchemyService.getCurrencyBalanceForPaymaster(
      network,
      "USDC",
      userOperations[0].sender
    ),
    AlchemyService.getCurrencyAllowanceForPaymaster(
      network,
      "USDC",
      userOperations[0].sender
    ),
  ]);
  const [batchOk, batchError] = PaymasterService.verifyUserOperations(
    userOperations,
    "USDC",
    balance,
    allowance,
    network
  );
  if (!batchOk) {
    throw new ApiError(httpStatus.BAD_REQUEST, batchError);
  }

  const response: SignResponse = {
    userOperations: await Promise.all(
      PaymasterService.signUserOperations(userOperations, "USDC", network)
    ),
  };
  res.send(response);
});

export const status = catchAsync(async (req, res) => {
  const { network, address } = req.query as {
    network: Networks;
    address: string;
  };

  const response: StatusResponse = {
    address: Env.PAYMASTER_ADDRESS,
    fees: DefaultFees,
    allowances: {
      USDC: await AlchemyService.getCurrencyAllowanceForPaymaster(
        network,
        "USDC",
        address
      ),
    },
  };

  res.send(response);
});
