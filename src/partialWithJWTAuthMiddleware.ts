import { Request, Response, ErrorRequestHandler } from "express";
import * as jwt from "jsonwebtoken";
import getTokenFromBearer from "./lib/getTokenFromBearer";
import jwtAuthMiddleware from "./lib/jwtAuthMiddleware";
import partialWithMiddleware from "./partialWithMiddleware";

type GetTokenFun = (req: Request) => any;
type PreCheckFun = (req: Request, res: Response) => any;

export default function partialWithJWTAuthMiddleware(
  secretKey: string,
  getToken: GetTokenFun = getTokenFromBearer,
  preCheckFun?: PreCheckFun,
  errorHandler?: ErrorRequestHandler,
  verifyOptions?: jwt.VerifyOptions
) {
  return partialWithMiddleware(
    jwtAuthMiddleware(
      secretKey,
      getToken,
      preCheckFun,
      errorHandler,
      verifyOptions
    )
  );
}
