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
  return function(routerOrMiddleware: RotuerOrMiddleware): Router | Function {
    let connectedMiddleware: RequestHandler[];
    if (isMiddlewareArray(middlewares)) {
      connectedMiddleware = middlewares;
    } else {
      connectedMiddleware = [middlewares];
    }
    if (isRouter(routerOrMiddleware)) {
      const routeObject = {
        get: function(path: PathParams, ...handlers: RequestHandler[]) {
          routerOrMiddleware.get(path, ...connectedMiddleware, ...handlers);
          return routerOrMiddleware;
        },
        post: function(path: PathParams, ...handlers: RequestHandler[]) {
          routerOrMiddleware.post(path, ...connectedMiddleware, ...handlers);
          return routerOrMiddleware;
        },
        put: function(path: PathParams, ...handlers: RequestHandler[]) {
          routerOrMiddleware.put(path, ...connectedMiddleware, ...handlers);
          return routerOrMiddleware;
        },
        delete: function(path: PathParams, ...handlers: RequestHandler[]) {
          routerOrMiddleware.delete(path, ...connectedMiddleware, ...handlers);
          return routerOrMiddleware;
        }
      };

      // @ts-ignore
      return {
        ...routerOrMiddleware,
        routeObject
      } as Router;
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
