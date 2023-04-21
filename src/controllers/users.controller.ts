import { NextFunction, Request, Response } from "express";
import { Successful } from "@/utils/statusCodes/successful";
import usersService from "@/services/users";

export async function getAllUsers(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const users = await usersService.getAllUsers();

    return response.status(Successful.OK).send(users);
  } catch (error) {
    next(error);
  }
}

export async function signIn(request: Request, response: Response, next: NextFunction) {
  try {
    const { token } = request.cookies;

    return response.status(Successful.CREATED).send({ token });
  } catch (error) {
    next(error);
  }
}

export async function signUp(request: Request, response: Response, next: NextFunction) {
  const {
    first_name,
    last_name,
    birth,
    email,
    password
  } = request.body;

  try {
    await usersService.signUp({
      first_name,
      last_name,
      birth,
      email,
      password
    });

    return response.sendStatus(Successful.CREATED);
  } catch (error) {
    next(error);
  }
}
