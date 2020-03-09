import { NextFunction, Request, Response } from "express";

const wrap = (fn: Function) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  fn(req, res, next).catch(next);
};

export default wrap;
