import { Request } from "express";
import { ERROR_MESSAGE } from "../constants";
import TokenError from "./TokenError";

export default function getTokenFromBearer(req: Request) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    throw new TokenError(ERROR_MESSAGE.NO_AUTH_HEADER);
  }
  try {
    const token = authorization.split("Bearer ")[1];
    if (!token) {
      throw new Error();
    }
    return token;
  } catch {
    throw new TokenError(ERROR_MESSAGE.INVALID_FORMAT_AUTH);
  }
}
