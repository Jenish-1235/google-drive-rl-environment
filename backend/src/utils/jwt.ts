import jwt from "jsonwebtoken";
import { config } from "../config/env";

export interface JWTPayload {
  userId: number;
  email: string;
}

export function generateToken(payload: JWTPayload): string {
  // @ts-ignore - Type compatibility issue with jsonwebtoken
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, config.jwt.secret) as JWTPayload;
}
