import { Request, Response } from "express";
import { ICustomError } from "@/errors/ICustomError";

export function errorHandler(error: ICustomError, request: Request, response: Response) {
  const { statusCode, message, details } = error;
  console.log("Rep:", response);
  return response.status(statusCode).json({
    message,
    details
  });
}
