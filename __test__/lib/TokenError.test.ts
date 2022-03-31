import { TokenError } from "../../src";

describe("TokenError", () => {
  it("can create error with type TokenError", () => {
    const msg = "No Authorization";
    function testTokenError() {
      throw new TokenError(msg);
    }
    const expectedError = {
      message: msg,
    };
    let actualError;
    try {
      testTokenError();
    } catch (e) {
      expect(e).toBeInstanceOf(TokenError);
      actualError = {
        message: (e as Error).message,
      };
    }
    expect(actualError).toEqual(expectedError);
  });
});
