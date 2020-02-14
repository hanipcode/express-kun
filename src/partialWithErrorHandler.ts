import { ErrorRequestHandler, Router } from "express";
import { IRouter, PathParams, RequestHandler } from "express-serve-static-core";

export default function partialWithErrorHandler(
  errorHandler: ErrorRequestHandler
): (router: Router) => void {
  return function(router: Router) {
    const routeObject = {
      use: router.use,
      get: (path: PathParams, ...handlers: any[]): Router => {
        router.get(path, ...handlers);
        router.use(errorHandler);
        return router;
      },
      post: (path: PathParams, ...handlers: any[]) => {
        router.post(path, ...handlers);
        router.use(errorHandler);
        return router;
      },
      delete: (path: PathParams, ...handlers: any[]) => {
        router.delete(path, ...handlers);
        router.use(errorHandler);
        return router;
      },
      put: (path: PathParams, ...handlers: any[]) => {
        router.put(path, ...handlers);
        router.use(errorHandler);
        return router;
      }
    };

    // @ts-ignore
    return {
      ...router,
      ...routeObject
    };
  };
}
