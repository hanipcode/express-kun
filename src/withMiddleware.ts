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

  router.get = function(path: PathParams, ...handlers: any[]) {
    const route = this.route(path);
    route.get.apply(route, [...connectedMiddleware, ...handlers]);
    return this;
  };

  router.post = function(path: PathParams, ...handlers: any[]) {
    const route = this.route(path);
    route.post.apply(route, [...connectedMiddleware, ...handlers]);
    return this;
  };

  router.put = function(path: PathParams, ...handlers: any[]) {
    const route = this.route(path);
    route.put.apply(route, [...connectedMiddleware, ...handlers]);
    return this;
  };

  router.delete = function(path: PathParams, ...handlers: any[]) {
    const route = this.route(path);
    route.delete.apply(route, [...connectedMiddleware, ...handlers]);
    return this;
  };

  return router;
}
