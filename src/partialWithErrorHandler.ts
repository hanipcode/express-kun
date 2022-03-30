import { ErrorRequestHandler, Router } from "express";
import { IRouter, PathParams, RequestHandler } from "express-serve-static-core";
import wrap from "./lib/wrap";
import withErrorHandler from "./withErrorHandler";

export default function partialWithErrorHandler(
  errorHandler: ErrorRequestHandler
): (router: Router) => void {
  return function (router: Router): Router {
    return withErrorHandler(router, errorHandler);
  };
}
