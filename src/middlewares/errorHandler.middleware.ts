import { NextFunction, Request, Response } from "express";
import { ICustomError } from "@/errors/ICustomError";
import { ClientErrors } from "@/utils/statusCodes/clientErrors";
import { ServerErrors } from "@/utils/statusCodes/serverErrors";

export function errorHandler(
  error: ICustomError,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (error.name === "ConflictError" || error.name === "DuplicatedEmailError") {
    return response.status(ClientErrors.CONFLICT).send({
      message: error.message,
    });
  }

  if (error.name === "InvalidDataError") {
    return response.status(ClientErrors.UNPROCESSABLE_ENTITY).send({
      message: error.message,
    });
  }

  if (error.name === "TypeError") {
    return response.status(ServerErrors.INTERNAL_SERVER_ERROR).send({
      message: error.message,
    });
  }

  return response.status(ServerErrors.INTERNAL_SERVER_ERROR).send({
    message: error.message,
  });
}
