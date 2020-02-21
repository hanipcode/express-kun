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
): Router {
  let connectedMiddleware: RequestHandler[];
  if (isMiddlewareArray(middlewares)) {
    connectedMiddleware = middlewares;
  } else {
    connectedMiddleware = [middlewares];
  }

  const routeObject = {
    use: router.use,
    get: (path: PathParams, ...handlers: any[]): Router => {
      return router.get(path, ...connectedMiddleware, ...handlers);
    },
    post: (path: PathParams, ...handlers: any[]) => {
      return router.post(path, ...connectedMiddleware, ...handlers);
    },
    delete: (path: PathParams, ...handlers: any[]) => {
      return router.delete(path, ...connectedMiddleware, ...handlers);
    },
    put: (path: PathParams, ...handlers: any[]) => {
      return router.put(path, ...connectedMiddleware, ...handlers);
    }
  };

  router.get = (path: PathParams, ...handlers: any[]): Router => {
    router.get(path, ...connectedMiddleware, ...handlers);
    return router;
  };

  router.post = (path: PathParams, ...handlers: any[]) => {
    router.post(path, ...connectedMiddleware, ...handlers);
    return router;
  };

  router.delete = (path: PathParams, ...handlers: any[]) => {
    router.delete(path, ...connectedMiddleware, ...handlers);
    return router;
  };

  router.put = (path: PathParams, ...handlers: any[]) => {
    router.put(path, ...connectedMiddleware, ...handlers);
    return router;
  };

  return router;
}
