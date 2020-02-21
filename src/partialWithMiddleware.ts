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
      routerOrMiddleware.get = (
        path: PathParams,
        ...handlers: any[]
      ): Router => {
        routerOrMiddleware.get(path, ...connectedMiddleware, ...handlers);
        return routerOrMiddleware;
      };

      routerOrMiddleware.post = (path: PathParams, ...handlers: any[]) => {
        routerOrMiddleware.post(path, ...connectedMiddleware, ...handlers);
        return routerOrMiddleware;
      };

      routerOrMiddleware.delete = (path: PathParams, ...handlers: any[]) => {
        routerOrMiddleware.delete(path, ...connectedMiddleware, ...handlers);
        return routerOrMiddleware;
      };

      routerOrMiddleware.put = (path: PathParams, ...handlers: any[]) => {
        routerOrMiddleware.put(path, ...connectedMiddleware, ...handlers);
        return routerOrMiddleware;
      };

      return routerOrMiddleware;
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
