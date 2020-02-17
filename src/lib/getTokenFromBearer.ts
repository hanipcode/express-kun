import { Request } from "express";
import TokenError from "./TokenError";

export default function getTokenFromBearer(req: Request) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    throw new TokenError("No Authorization Header");
  }
  try {
    const token = authorization?.split("Bearer ")[1];
    return token;
  } catch {
    throw new TokenError("Invalid Token Format");
  }
}
