import { NextFunction, Request, Response } from "express";
import { Successful } from "@/utils/statusCodes/successful";
import usersServices from "@/services/users";

export async function signup(request: Request, response: Response, next: NextFunction) {
  try {
    const { email, password, confirmPassword } = request.body;

    await usersServices.signup({ email, password, confirmPassword });

    return response.sendStatus(Successful.CREATED);
  } catch (error) {
    next(error);
  }
}

export async function signin(request: Request, response: Response, next: NextFunction) {
  try {
    const { email, password } = request.body;

    const token = await usersServices.signin({ email, password }, response);

    return response.status(Successful.CREATED).send(token);
  } catch (error) {
    next(error);
  }
}
