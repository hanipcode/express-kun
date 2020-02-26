import { ErrorRequestHandler, Router } from "express";
import { IRouter, PathParams, RequestHandler } from "express-serve-static-core";
import wrap from "./lib/wrap";

export default function partialWithErrorHandler(
  errorHandler: ErrorRequestHandler
): (router: Router) => void {
  return function(router: Router) {
    const routeObject = {
      get: function(path: PathParams, ...handlers: RequestHandler[]) {
        const mappedHandlers = handlers.map(wrap);
        router.get(path, mappedHandlers, errorHandler);
      },
      post: function(path: PathParams, ...handlers: RequestHandler[]) {
        const mappedHandlers = handlers.map(wrap);
        router.post(path, mappedHandlers, errorHandler);
      },
      put: function(path: PathParams, ...handlers: RequestHandler[]) {
        const mappedHandlers = handlers.map(wrap);
        router.put(path, mappedHandlers, errorHandler);
      },
      delete: function(path: PathParams, ...handlers: RequestHandler[]) {
        const mappedHandlers = handlers.map(wrap);
        router.delete(path, mappedHandlers, errorHandler);
      }
    };

    return {
      ...router,
      ...routeObject
    };
  };
}
