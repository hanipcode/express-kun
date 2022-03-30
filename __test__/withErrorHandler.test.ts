import request from "supertest";
import express from "express";
import { withErrorHandler } from "../src";
import { OVERRIDEN_ROUTES } from "./constants";

describe("withErrorHandler", () => {
  describe.each(OVERRIDEN_ROUTES)(
    "it work for route with type %s",
    (routeType) => {
      // // @ts-ignore
      const dataText = "testErrorHandler";
      it("can goes to error handler on error", async () => {
        const dataText = "testErrorHandler";
        // @ts-ignore
        const errorHandler = jest.fn((err, req, res, next) => {
          if (!err) {
            next();
            return;
          }
          res.json({
            error: true,
            data: dataText,
          });
          next();
        });

        const app = express();
        const router = express.Router();
        const withErrorHandlerRoute = withErrorHandler(router, errorHandler);
        withErrorHandlerRoute[routeType]("/", (req, res, next) => {
          next("ErrorTesting");
        });
        app.use(router);

        const agent = request(app);
        const response = await agent[routeType]("/");
        const data = JSON.parse(response.text);
        expect(errorHandler).toHaveBeenCalled();
        expect(data.data).toEqual(dataText);
      });

      it("can stack error handler, stacked from the first handler first", async () => {
        let errorMessageFromRoute = "";
        let messageFromFirstErrorHandler = "";
        const expectedMessageFromRoute = "ErrorTesting";
        const expectedMessageFromFirstErrorHandler =
          "Error From the First Error Handler";
        const errorHandler1 = jest.fn((err, req, res, next) => {
          errorMessageFromRoute = expectedMessageFromRoute;
          next(expectedMessageFromFirstErrorHandler);
          return;
        });
        const errorHandler2 = jest.fn((err, req, res, next) => {
          messageFromFirstErrorHandler = err;
          if (!err) {
            next();
            return;
          }
          res.json({
            error: true,
            data: dataText,
          });
        });
        const app = express();
        const router = express.Router();
        const withErrorHandlerRoute1 = withErrorHandler(router, errorHandler1);
        // @ts-ignore
        const withErorrHandlerRoute2 = withErrorHandler(router, errorHandler2);
        // @ts-ignore
        withErorrHandlerRoute2[routeType]("/", (req, res, next) => {
          next(expectedMessageFromRoute);
        });
        app.use(router);
        const agent = request(app);
        const response = await agent[routeType]("/");
        const data = JSON.parse(response.text);
        expect(errorHandler1).toHaveBeenCalled();
        expect(errorHandler2).toHaveBeenCalled();
        expect(errorMessageFromRoute).toEqual(expectedMessageFromRoute);
        expect(messageFromFirstErrorHandler).toEqual(
          expectedMessageFromFirstErrorHandler
        );
        expect(data.data).toEqual(dataText);
      });
    }
  );
});
