import { Router } from "express";
import { IRouter, PathParams, RequestHandler } from "express-serve-static-core";

type SupportedMiddleware = RequestHandler | RequestHandler[];

function isMiddlewareArray(
  middleware: SupportedMiddleware
): middleware is RequestHandler[] {
  return Array.isArray(middleware);
}

export default function withMiddleware(
  router: Router,
  middlewares: SupportedMiddleware
) {
  let connectedMiddleware: RequestHandler[];
  if (isMiddlewareArray(middlewares)) {
    connectedMiddleware = middlewares;
  } else {
    connectedMiddleware = [middlewares];
  }

  const routeObject = {
    get: function(path: PathParams, ...handlers: RequestHandler[]) {
      router.get(path, ...connectedMiddleware, ...handlers);
      return router;
    },
    post: function(path: PathParams, ...handlers: RequestHandler[]) {
      router.post(path, ...connectedMiddleware, ...handlers);
      return router;
    },
    put: function(path: PathParams, ...handlers: RequestHandler[]) {
      router.put(path, ...connectedMiddleware, ...handlers);
      return router;
    },
    delete: function(path: PathParams, ...handlers: RequestHandler[]) {
      router.delete(path, ...connectedMiddleware, ...handlers);
      return router;
    }
  };

  return {
    ...router,
    ...routeObject
  };
}
