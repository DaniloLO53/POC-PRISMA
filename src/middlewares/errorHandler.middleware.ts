import { NextFunction, Request, Response } from "express";
import { ICustomError } from "@/errors/ICustomError";
import { ServerErrors } from "@/utils/statusCodes/serverErrors";
import { ClientErrors } from "@/utils/statusCodes/clientErrors";

export function errorHandler(
  error: ICustomError,
  request: Request,
  response: Response,
  next: NextFunction
) {

  if (error.name === "JsonWebTokenError") error.statusCode = ClientErrors.UNAUTHORIZED;

  console.log("Error name: ", error.name);
  console.log("Error message: ", error.message);
  console.log("Error body: ", error);

  return response.status(error.statusCode || ServerErrors.INTERNAL_SERVER_ERROR).send({
    message: error.message,
  });
}
