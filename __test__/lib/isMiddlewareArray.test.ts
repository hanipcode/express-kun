import isMiddlewareArray from "../../src/lib/isMiddlewareArray";

// @ts-ignore
function middleware(req, res, next) {
  return res.json({});
}

describe("is middleware array", () => {
  it.each([
    ["array", true, [middleware, middleware]],
    ["middleware function", false, middleware],
  ])(
    `describe that for param with type "%s" it return "%s"`,
    (name, expected, param) => {
      expect(isMiddlewareArray(param)).toEqual(expected);
    }
  );
});
