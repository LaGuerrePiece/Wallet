import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { ApiError } from "../utils";
import { Env, AlchemyValidIPs } from "../config";

export const validateAlchemyIP = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  // Use PREFERRED_IP_HEADER if can rely on a specific header to get connecting IP address
  const ip = Env.PREFERRED_IP_HEADER
    ? req.get(Env.PREFERRED_IP_HEADER) ?? ""
    : (req.get("x-forwarded-for") ?? "").split(",").pop()?.trim() ??
      req.socket.remoteAddress ??
      "";

  if (AlchemyValidIPs.has(ip)) {
    return next();
  } else {
    return next(
      new ApiError(httpStatus.UNAUTHORIZED, "Not a recognized IP address")
    );
  }
};
