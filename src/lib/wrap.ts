const wrap = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = fn(req, res, next);
    return result.catch(next);
  } catch (err) {
    return next(err);
  }
};

export default wrap;
