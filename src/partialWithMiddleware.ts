import { Router } from "express";
import { IRouter, PathParams, RequestHandler } from "express-serve-static-core";
import withMiddleware from "./withMiddleware";

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
  return function (routerOrMiddleware: RotuerOrMiddleware): Router | Function {
    let connectedMiddleware: RequestHandler[];
    if (isMiddlewareArray(middlewares)) {
      connectedMiddleware = middlewares;
    } else {
      connectedMiddleware = [middlewares];
    }
    if (isRouter(routerOrMiddleware)) {
      return withMiddleware(routerOrMiddleware, middlewares);
    }

    let reconnectedMiddleware: RequestHandler[];
    if (isMiddlewareArray(routerOrMiddleware)) {
      reconnectedMiddleware = routerOrMiddleware;
    } else {
      reconnectedMiddleware = [routerOrMiddleware];
    }
    return partialWithMiddleware([
      ...connectedMiddleware,
      ...reconnectedMiddleware,
    ]);
  };
}
