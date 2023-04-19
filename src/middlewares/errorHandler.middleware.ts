import { Request, Response } from "express";
import { ICustomError } from "@/errors/ICustomError";

export function errorHandler(
  error: ICustomError,
  request: Request,
  response: Response,
) {
  console.log("Oi meu chapa");
  const { statusCode, message, details } = error;
  console.log("Rep:", response);
  console.log("Err:", error.message);
  return response.status(statusCode).json("birubiru");
}
