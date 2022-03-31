import {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
  Router,
} from "express";
import * as jwt from "jsonwebtoken";
import getTokenFromBearer from "./lib/getTokenFromBearer";
import jwtAuthMiddleware from "./lib/jwtAuthMiddleware";
import withMiddleware from "./withMiddleware";

type GetTokenFun = (req: Request) => any;
type PreCheckFun = (req: Request, res: Response) => any;

export default function withJWTAuthMiddleware(
  router: Router,
  secretKey: string,
  getToken: GetTokenFun = getTokenFromBearer,
  preCheckFun?: PreCheckFun,
  errorHandler?: ErrorRequestHandler,
  verifyOptions?: jwt.VerifyOptions
) {
  return withMiddleware(
    router,
    jwtAuthMiddleware(
      secretKey,
      getToken,
      preCheckFun,
      errorHandler,
      verifyOptions
    )
  );
}
