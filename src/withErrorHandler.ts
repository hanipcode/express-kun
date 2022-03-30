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
      originalProto.post.call(this, path, mappedHandlers, errorHandler);
    },
    get: function (path: PathParams, ...handlers: RequestHandler[]) {
      console.log("HA");
      const mappedHandlers = handlers.map(wrap);
      originalProto.get.call(this, path, mappedHandlers, errorHandler);
    },
    put: function (path: PathParams, ...handlers: RequestHandler[]) {
      const mappedHandlers = handlers.map(wrap);
      originalProto.put.call(this, path, mappedHandlers, errorHandler);
    },
    delete: function (path: PathParams, ...handlers: RequestHandler[]) {
      const mappedHandlers = handlers.map(wrap);
      originalProto.delete.call(this, path, mappedHandlers, errorHandler);
    },
  });

  return router;
}
