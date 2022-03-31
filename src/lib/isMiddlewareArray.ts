import { RequestHandler } from "express-serve-static-core";

export type SupportedMiddleware = RequestHandler | RequestHandler[];

export default function isMiddlewareArray(
  middleware: SupportedMiddleware
): middleware is RequestHandler[] {
  return Array.isArray(middleware);
}
