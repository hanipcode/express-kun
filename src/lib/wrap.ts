import { NextFunction, Request, Response } from "express";

const wrap = (fn: Function) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await fn(req, res, next);
    return result.catch(next);
  } catch (err) {
    return next(err);
  }
};

export default wrap;
