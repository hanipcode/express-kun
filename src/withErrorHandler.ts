import { ErrorRequestHandler, Router, NextFunction } from "express";
import { IRouter, PathParams, RequestHandler } from "express-serve-static-core";

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

export default function withErrorHandler(
  router: Router,
  errorHandler: ErrorRequestHandler
): Router {
  const routeObject = {
    use: router.use,
    get: (path: PathParams, ...handlers: any[]): Router => {
      // @ts-ignore
      router.get(path, ...handlers.map(wrap));
      router.use(errorHandler);
      return router;
    },
    post: (path: PathParams, ...handlers: any[]) => {
      // @ts-ignore
      router.post(path, ...handlers.map(wrap));
      router.use(errorHandler);
      return router;
    },
    delete: (path: PathParams, ...handlers: any[]) => {
      // @ts-ignore
      router.delete(path, ...handlers.map(wrap));
      router.use(errorHandler);
      return router;
    },
    put: (path: PathParams, ...handlers: any[]) => {
      // @ts-ignore
      router.put(path, ...handlers.map(wrap));
      router.use(errorHandler);
      return router;
    }
  };

  // @ts-ignore
  return {
    ...router,
    ...routeObject
  };
}
