import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { invalidDataError } from "@/errors/invalidData.errors";

export function validateBody(schema: ObjectSchema): ValidationMiddleware {
  return validate(schema, "body");
}

export function validateParams(schema: ObjectSchema): ValidationMiddleware {
  return validate(schema, "params");
}

function validate(schema: ObjectSchema, type: SchemaType) {
  return function(request: Request, response: Response, next: NextFunction) {
    const { error } = schema.validate(request[type], { abortEarly: false });

    if (error) {
      const details = error.details?.map((detail) => detail.message) || [];
      const customError = invalidDataError(details);

      next(customError);
    } else {
      next();
    }
  };
}

type SchemaType = "body" | "params";
type ValidationMiddleware = (
  request: Request, response: Response, next: NextFunction
) => void;
