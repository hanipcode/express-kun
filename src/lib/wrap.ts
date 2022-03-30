import { NextFunction, Request, Response } from "express";

const wrap =
  (fn: Function) => async (req: Request, res: Response, next: NextFunction) => {
    if (typeof fn === "function") {
      fn(req, res, next);
    }
  };

export default wrap;
