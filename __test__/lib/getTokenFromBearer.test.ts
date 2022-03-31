import request from "supertest";
import express from "express";
import { getTokenFromBearer, TokenError } from "../../src";
import { ERROR_MESSAGE } from "../../src/constants";

describe("getTokenFromBearer", () => {
  it("can get token from the bearer", async () => {
    const app = express();
    const router = express.Router();
    const token = "testTokenOi";
    // @ts-ignore
    router.get("/", (req, res) => {
      res.send(getTokenFromBearer(req));
    });
    app.use(router);
    const agent = request.agent(app);
    const response = await agent
      .get("/")
      .set("Authorization", `Bearer ${token}`)
      .send();
    expect(response.text).toEqual(token);
  });

  it("throw error when there is no Authorization header", async () => {
    const app = express();
    const router = express.Router();
    let errorObj: any;
    // @ts-ignore
    router.get("/", (req, res) => {
      res.send(getTokenFromBearer(req));
    });
    app.use(router);
    // @ts-ignore
    app.use((err, req, res, next) => {
      if (err) {
        errorObj = err;
      }
      next();
    });
    const agent = request.agent(app);
    await agent.get("/").send();
    expect(errorObj).toEqual(new TokenError(ERROR_MESSAGE.NO_AUTH_HEADER));
  });

  it("throw error when authorization header is not with bearer format", async () => {
    const app = express();
    const router = express.Router();
    let errorObj: any;
    // @ts-ignore
    router.get("/", (req, res) => {
      res.send(getTokenFromBearer(req));
    });
    app.use(router);
    // @ts-ignore
    app.use((err, req, res, next) => {
      if (err) {
        errorObj = err;
      }
      next();
    });
    const agent = request.agent(app);
    await agent.get("/").set("Authorization", "Bambang Token").send();
    expect(errorObj).toEqual(new TokenError(ERROR_MESSAGE.INVALID_FORMAT_AUTH));
  });
});
