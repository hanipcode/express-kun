export default class TokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenNotFoundError";

    Object.setPrototypeOf(this, TokenError.prototype);
  }
}
