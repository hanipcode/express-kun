import { Router } from "express";
import { PathParams, RequestHandler } from "express-serve-static-core";
import isMiddlewareArray, {
  SupportedMiddleware,
} from "./lib/isMiddlewareArray";

export default function withMiddleware(
  router: Router,
  middlewares: SupportedMiddleware
): Router {
  let connectedMiddleware: RequestHandler[];
  if (isMiddlewareArray(middlewares)) {
    connectedMiddleware = middlewares;
  } else {
    connectedMiddleware = [middlewares];
  }
  const originalProto = Object.getPrototypeOf(router);

  Object.setPrototypeOf(router, {
    ...originalProto,
    get: function (path: PathParams, ...handlers: RequestHandler[]) {
      originalProto.get.call(this, path, ...connectedMiddleware, ...handlers);
      return router;
    },
    post: function (path: PathParams, ...handlers: RequestHandler[]) {
      originalProto.post.call(this, path, ...connectedMiddleware, ...handlers);
      return router;
    },
    put: function (path: PathParams, ...handlers: RequestHandler[]) {
      originalProto.put.call(this, path, ...connectedMiddleware, ...handlers);
      return router;
    },
    delete: function (path: PathParams, ...handlers: RequestHandler[]) {
      originalProto.delete.call(
        this,
        path,
        ...connectedMiddleware,
        ...handlers
      );
      return router;
    },
  });

  return router;
}
