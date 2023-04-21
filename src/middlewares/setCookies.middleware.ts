import { NextFunction, Request, Response } from "express";
import usersService from "@/services/users";

export async function setCookies(
  request: Request, response: Response, next: NextFunction) {
  const { email, password } = request.body;

  try {
    const token = await usersService.signIn({ email, password });
    const maxAge = 3 * 24 * 60 * 60 * 1000; 

    response.cookie("token", token, { httpOnly: true, maxAge });
    next();
  } catch (error) {
    next(error);
  }
}
