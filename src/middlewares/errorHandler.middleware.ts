import { NextFunction, Request, Response } from "express";
import { ICustomError } from "@/errors/ICustomError";
import { ClientErrors } from "@/utils/statusCodes/clientErrors";

export function errorHandler(
  error: ICustomError,
  request: Request,
  response: Response,
  next: NextFunction
) {
  console.log("Oi meu chapa");

  if (error.name === "ConflictError" || error.name === "DuplicatedEmailError") {
    return response.status(ClientErrors.CONFLICT).send({
      message: error.message,
    });
  }
}
