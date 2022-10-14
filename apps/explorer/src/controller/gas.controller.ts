import { BigNumberish } from "ethers";
import { Networks } from "@stackupfinance/config";
import { catchAsync } from "../utils";
import * as BlocknativeService from "../services/blocknative.service";

interface GetResponse {
  maxPriorityFeePerGas: BigNumberish;
  maxFeePerGas: BigNumberish;
}

export const estimator = catchAsync(async (req, res) => {
  const { network } = req.query as { network: Networks };

  const response: GetResponse = await BlocknativeService.getGasEstimate(
    network
  );
  res.send(response);
});
