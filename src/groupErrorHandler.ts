import {
  Application,
  ErrorRequestHandler,
  NextFunction,
  Response,
  Router
} from "express";

type RouterOrApplication = Application | Router;

function isApplication(
  routerOrApp: RouterOrApplication
): routerOrApp is Application {
  return (
    (routerOrApp as Application).set !== undefined &&
    typeof (routerOrApp as Application).set === "function"
  );
}

export default function groupErrorHandler(
  routerOrApp: RouterOrApplication,
  handler: ErrorRequestHandler
) {
  return function(callback: (router: Router) => void) {
    callback(routerOrApp);
    routerOrApp.use(handler);
  };
}
