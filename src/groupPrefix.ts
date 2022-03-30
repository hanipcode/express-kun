import { Application, Router } from "express";
import { PathParams } from "express-serve-static-core";

type RouterOrApplication = Application | Router;

function isApplication(
  routerOrApp: RouterOrApplication
): routerOrApp is Application {
  return (
    (routerOrApp as Application).set !== undefined &&
    typeof (routerOrApp as Application).set === "function"
  );
}

export default function groupPrefix(router: Router, prefix: string) {
  function getPrefixedPath(path: PathParams) {
    return `${prefix}${path}`;
  }

  const originalProto = Object.getPrototypeOf(router);
  Object.setPrototypeOf(router, {
    ...originalProto,
    get: function (path: PathParams, ...handlers: any[]) {
      return originalProto.get.call(this, getPrefixedPath(path), ...handlers);
    },
    post: function (path: PathParams, ...handlers: any[]) {
      return originalProto.post.call(this, getPrefixedPath(path), ...handlers);
    },
    delete: function (path: PathParams, ...handlers: any[]) {
      return originalProto.delete.call(
        this,
        getPrefixedPath(path),
        ...handlers
      );
    },
    put: function (path: PathParams, ...handlers: any[]) {
      return originalProto.put.call(this, getPrefixedPath(path), ...handlers);
    },
  });

  return function (callback: (router: Router) => void) {
    callback(router);
  };
}
