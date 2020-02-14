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
      const routeObject = {
        use: routerOrMiddleware.use,
        get: (path: PathParams, ...handlers: any[]): Router => {
          console.log("dipanggil");
          return routerOrMiddleware.get(
            path,
            ...connectedMiddleware,
            ...handlers
          );
        },
        post: (path: PathParams, ...handlers: any[]) => {
          return routerOrMiddleware.post(
            path,
            ...connectedMiddleware,
            ...handlers
          );
        },
        delete: (path: PathParams, ...handlers: any[]) => {
          return routerOrMiddleware.delete(
            path,
            ...connectedMiddleware,
            ...handlers
          );
        },
        put: (path: PathParams, ...handlers: any[]) => {
          return routerOrMiddleware.put(
            path,
            ...connectedMiddleware,
            ...handlers
          );
        }
      };

      // @ts-ignore
      return {
        ...routerOrMiddleware,
        ...routeObject
      };
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
