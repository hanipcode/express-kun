import { OVERRIDEN_ROUTES } from "./constants";
import withMiddleware from "../src/withMiddleware";
import request from "supertest";
import express from "express";

describe("withMiddleware", () => {
  describe.each(OVERRIDEN_ROUTES)(
    "it work for route with type %s",
    (routeType) => {
      // @ts-ignore
      it("work for single midleware", async () => {
        const dataText = "errorTesting";
        // @ts-ignore
        function middleware(req, res, next) {
          res.locals.isMiddlewared = true;
          next();
        }

        const app = express();
        const router = express.Router();
        const middlewaredRoute = withMiddleware(router, middleware);

        // @ts-ignore
        middlewaredRoute[routeType]("/", (req, res, next) => {
          res.json({
            locals: res.locals,
            dataText,
          });
        });

        app.use(middlewaredRoute);

        const agent = request(app);
        const response = await agent[routeType]("/");
        const json = JSON.parse(response.text);
        expect(response.status).toEqual(200);
        expect(json.dataText).toEqual(dataText);
        expect(json.locals.isMiddlewared).toEqual(true);
      });

      it("work for middleware array", async () => {
        const dataText = "errorTesting";
        // @ts-ignore
        function middleware(req, res, next) {
          if (!res.locals.isMiddlewaredArr) {
            res.locals.isMiddlewaredArr = [];
          }
          res.locals.isMiddlewaredArr.push(true);
          next();
        }

        const app = express();
        const router = express.Router();
        const middlewaredRoute = withMiddleware(router, [
          middleware,
          middleware,
        ]);

        // @ts-ignore
        middlewaredRoute[routeType]("/", (req, res, next) => {
          res.json({
            locals: res.locals,
            dataText,
          });
        });

        app.use(middlewaredRoute);

        const agent = request(app);
        const response = await agent[routeType]("/");
        const json = JSON.parse(response.text);
        expect(response.status).toEqual(200);
        expect(json.dataText).toEqual(dataText);
        expect(json.locals.isMiddlewaredArr).toEqual([true, true]);
      });

      it("work on chained", async () => {
        const dataText = "errorTesting";
        // @ts-ignore
        function middleware(req, res, next) {
          if (!res.locals.content) {
            res.locals.content = [];
          }
          res.locals.content.push(1);
          next();
        }
        // @ts-ignore
        function middleware2(req, res, next) {
          res.locals.content.push(2);
          next();
        }

        const app = express();
        const router = express.Router();
        const middlewaredRoute = withMiddleware(
          withMiddleware(router, middleware),
          middleware2
        );

        // @ts-ignore
        middlewaredRoute[routeType]("/", (req, res, next) => {
          res.json({
            locals: res.locals,
            dataText,
          });
        });

        app.use(middlewaredRoute);

        const agent = request(app);
        const response = await agent[routeType]("/");
        const json = JSON.parse(response.text);
        expect(response.status).toEqual(200);
        expect(json.dataText).toEqual(dataText);
        expect(json.locals.content).toEqual([1, 2]);
      });
    }
  );
});
