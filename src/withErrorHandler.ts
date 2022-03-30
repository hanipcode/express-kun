import { ErrorRequestHandler, Router } from "express";
import { IRouter, PathParams, RequestHandler } from "express-serve-static-core";
import wrap from "./lib/wrap";

export default function withErrorHandler(
  router: Router,
  errorHandler: ErrorRequestHandler
): Router {
  const originalProto = Object.getPrototypeOf(router);
  Object.setPrototypeOf(router, {
    ...originalProto,
    post: function (path: PathParams, ...handlers: RequestHandler[]) {
      const mappedHandlers = handlers.map(wrap);
      return originalProto.post
        .call(this, path, ...mappedHandlers)
        .use(errorHandler);
    },
    get: function (path: PathParams, ...handlers: RequestHandler[]) {
      const mappedHandlers = handlers.map(wrap);
      return originalProto.get
        .call(this, path, ...mappedHandlers)
        .use(errorHandler);
    },
    put: function (path: PathParams, ...handlers: RequestHandler[]) {
      const mappedHandlers = handlers.map(wrap);
      return originalProto.put
        .call(this, path, ...mappedHandlers)
        .use(errorHandler);
    },
    delete: function (path: PathParams, ...handlers: RequestHandler[]) {
      const mappedHandlers = handlers.map(wrap);
      return originalProto.delete
        .call(this, path, ...mappedHandlers)
        .use(errorHandler);
    },
  });

  return router;
}
