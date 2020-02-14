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

  const routeObject = {
    use: router.use,
    get: (path: PathParams, ...handlers: any[]): Router => {
      return router.get(getPrefixedPath(path), ...handlers);
    },
    post: (path: PathParams, ...handlers: any[]) => {
      return router.post(getPrefixedPath(path), ...handlers);
    },
    delete: (path: PathParams, ...handlers: any[]) => {
      return router.delete(getPrefixedPath(path), ...handlers);
    },
    put: (path: PathParams, ...handlers: any[]) => {
      return router.put(getPrefixedPath(path), ...handlers);
    }
  };

  const prefixedRoute = {
    ...router,
    ...routeObject
  };
  return function(callback: (router: Router) => void) {
    // @ts-ignore
    callback(prefixedRoute);
  };
}
