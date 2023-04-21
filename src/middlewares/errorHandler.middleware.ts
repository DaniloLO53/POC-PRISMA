import { NextFunction, Request, Response } from "express";
import { ICustomError } from "@/errors/ICustomError";

export function errorHandler(
  error: ICustomError,
  request: Request,
  response: Response,
  next: NextFunction
) {

  return response.status(error.statusCode).send({
    message: error.message,
  });
}
