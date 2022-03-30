import request from "supertest";
import express from "express";
import { withErrorHandler } from "../src";

describe("withErrorHandler", () => {
  // @ts-ignore
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
    withErrorHandlerRoute.get("/", (req, res, next) => {
      next("ErrorTesting");
    });
    app.use(router);

    const agent = request(app);
    const response = await agent.get("/");
    const data = JSON.parse(response.text);
    expect(errorHandler).toHaveBeenCalled();
    expect(data.data).toEqual(dataText);
  });

  it("can stack error handler", async () => {
    const errorHandler1 = jest.fn((err, req, res, next) => {
      next("error2");
    });
    const errorHandler2 = jest.fn((err, req, res, next) => {
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
    const withErrorHandlerRoute1 = withErrorHandler(router, errorHandler1);
    const withErorrHandlerRoute2 = withErrorHandler(router, errorHandler2);
    withErrorHandlerRoute1.get("/", (req, res, next) => {
      next("ErrorTesting");
    });
    app.use(router);

    const agent = request(app);
    const response = await agent.get("/");
    // const data = JSON.parse(response.text);
    // expect(errorHandler1).toHaveBeenCalled();
    // expect(errorHandler2).toHaveBeenCalled();
    // expect(data.data).toEqual(dataText);
  });
});
