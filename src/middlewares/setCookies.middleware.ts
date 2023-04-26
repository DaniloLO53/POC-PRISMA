import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export async function setCookies(
  request: Request, response: Response, next: NextFunction) {
  const { email, password } = request.body;
  const expiresIn = "3d";
  const key = process.env.JWT_SECRET || "secret";

  try {
    const token = jwt.sign({ user: { email } }, key, { expiresIn });

    const maxAge = 3 * 24 * 60 * 60 * 1000;

    console.log("Token that put on cookies: ", token);

    response.cookie("token", token, { httpOnly: true, maxAge });
    response.locals.passoword = password;
    next();
  } catch (error) {
    next(error);
  }
}
