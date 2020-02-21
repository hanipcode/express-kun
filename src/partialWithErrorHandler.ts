import { ErrorRequestHandler, Router } from "express";
import { IRouter, PathParams, RequestHandler } from "express-serve-static-core";
import wrap from "./lib/wrap";

export default function partialWithErrorHandler(
  errorHandler: ErrorRequestHandler
): (router: Router) => void {
  return function(router: Router) {
    router.get = (path: PathParams, ...handlers: any[]): Router => {
      const mappedHandlers: any[] = handlers.map(wrap);
      router.get(path, ...mappedHandlers);
      router.use(errorHandler);
      return router;
    };

    router.post = (path: PathParams, ...handlers: any[]) => {
      const mappedHandlers: any[] = handlers.map(wrap);
      router.post(path, mappedHandlers);
      router.use(errorHandler);
      return router;
    };

    router.delete = (path: PathParams, ...handlers: any[]) => {
      const mappedHandlers: any[] = handlers.map(wrap);
      router.delete(path, mappedHandlers);
      router.use(errorHandler);
      return router;
    };

    router.put = (path: PathParams, ...handlers: any[]) => {
      const mappedHandlers: any[] = handlers.map(wrap);
      router.put(path, mappedHandlers);
      router.use(errorHandler);
      return router;
    };

    return router;
  };
}
