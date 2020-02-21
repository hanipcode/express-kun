import { ErrorRequestHandler, Router } from "express";
import { IRouter, PathParams, RequestHandler } from "express-serve-static-core";
import wrap from "./lib/wrap";

export default function withErrorHandler(
  router: Router,
  errorHandler: ErrorRequestHandler
): Router {
  const extendedRouter = Router();
  extendedRouter.get = function(path: PathParams, ...handlers: any[]) {
    const route = this.route(path);
    const mappedHandlers = handlers.map(wrap);
    route.get.apply(route, mappedHandlers);
    this.use(errorHandler);
    return this;
  };

  extendedRouter.post = function(path: PathParams, ...handlers: any[]) {
    const route = this.route(path);
    const mappedHandlers = handlers.map(wrap);
    route.post.apply(route, mappedHandlers);
    this.use(errorHandler);
    return this;
  };

  extendedRouter.put = function(path: PathParams, ...handlers: any[]) {
    const route = this.route(path);
    const mappedHandlers = handlers.map(wrap);
    route.put.apply(route, mappedHandlers);
    this.use(errorHandler);
    return this;
  };

  extendedRouter.delete = function(path: PathParams, ...handlers: any[]) {
    const route = this.route(path);
    const mappedHandlers = handlers.map(wrap);
    route.delete.apply(route, mappedHandlers);
    this.use(errorHandler);
    return this;
  };

  router.use(extendedRouter);
  return extendedRouter;
}
