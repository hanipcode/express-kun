import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import TokenError from "./TokenError";

type GetTokenFun = (req: Request) => any;
type PreCheckFun = (req: Request, res: Response) => any;

export default function jwtAuthMiddleware(
  secretKey: string,
  getToken: GetTokenFun,
  preCheckFun?: PreCheckFun,
  errorHandler?: ErrorRequestHandler,
  verifyOptions?: jwt.VerifyOptions
) {
  return async function middleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = await getToken(req);
      if (preCheckFun) {
        preCheckFun(req, res);
      }
      await jwt.verify(token, secretKey, verifyOptions);
      res.locals.token = token;
      res.locals.decoded = jwt.decode(token);
      next();
    } catch (e) {
      if (errorHandler) {
        errorHandler(e, req, res, next);
        return;
      }
      if (e instanceof jwt.TokenExpiredError) {
        res.status(401).json({
          message: "Session Expired",
          error: e.message,
          tokenExpired: true,
        });
        return;
      }
      if (e instanceof jwt.JsonWebTokenError || e instanceof TokenError) {
        res.status(401).json({
          message: "Invalid Token",
          error: e.message,
        });
        return;
      }
      res.status(500).json({
        message: "Internal server Error",
        error: (e as Error).message,
        stack: (e as Error).stack,
      });
    }
  };
}
