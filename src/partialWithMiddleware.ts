import { Router } from "express";
import { IRouter, PathParams, RequestHandler } from "express-serve-static-core";

type SupportedMiddleware = RequestHandler | RequestHandler[];
type RotuerOrMiddleware = Router | SupportedMiddleware;

function isMiddlewareArray(
  middleware: SupportedMiddleware
): middleware is RequestHandler[] {
  return Array.isArray(middleware);
}

function isRouter(
  routerOrMiddleware: RotuerOrMiddleware
): routerOrMiddleware is Router {
  return routerOrMiddleware instanceof Router;
}

export default function partialWithMiddleware(
  middlewares: SupportedMiddleware
): (routerOrMiddleware: RotuerOrMiddleware) => void {
  return function(routerOrMiddleware: RotuerOrMiddleware) {
    let connectedMiddleware: RequestHandler[];
    if (isMiddlewareArray(middlewares)) {
      connectedMiddleware = middlewares;
    } else {
      connectedMiddleware = [middlewares];
    }
    if (isRouter(routerOrMiddleware)) {
      const extendedRouter = Router();
      extendedRouter.get = function(path: PathParams, ...handlers: any[]) {
        const route = this.route(path);
        route.get.apply(route, [...connectedMiddleware, ...handlers]);
        return this;
      };

      extendedRouter.post = function(path: PathParams, ...handlers: any[]) {
        const route = this.route(path);
        route.post.apply(route, [...connectedMiddleware, ...handlers]);
        return this;
      };

      extendedRouter.put = function(path: PathParams, ...handlers: any[]) {
        const route = this.route(path);
        route.put.apply(route, [...connectedMiddleware, ...handlers]);
        return this;
      };

      extendedRouter.delete = function(path: PathParams, ...handlers: any[]) {
        const route = this.route(path);
        route.delete.apply(route, [...connectedMiddleware, ...handlers]);
        return this;
      };

      routerOrMiddleware.use(extendedRouter);
      return extendedRouter;
    }

    let reconnectedMiddleware: RequestHandler[];
    if (isMiddlewareArray(routerOrMiddleware)) {
      reconnectedMiddleware = routerOrMiddleware;
    } else {
      reconnectedMiddleware = [routerOrMiddleware];
    }
    return partialWithMiddleware([
      ...connectedMiddleware,
      ...reconnectedMiddleware
    ]);
  };
}
