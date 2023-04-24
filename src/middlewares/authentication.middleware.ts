import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { unauthorizedError } from "@/errors/unauthorizedError.errors";

dotenv.config();

export function authenticateToken(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Secret token is undefined");

  try {
    const authHeader = request.header("Authorization");
    if (!authHeader) throw unauthorizedError();

    const [tokenType, token] = authHeader.split(" ");
    if (!token || tokenType !== "Bearer") throw unauthorizedError();

    const { user } = jwt
      .verify(token, secret) as jwt.JwtPayload;

    request.userId = user.id;

    next();
  } catch (error) {
    next(error);
  }

}

export interface AuthenticatedRequest extends Request {
  userId: number
}
