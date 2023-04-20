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

export async function postUser(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const {
    first_name,
    last_name,
    birth,
    email,
    password
  } = request.body;

  try {
    await usersService.postUser({
      first_name,
      last_name,
      birth,
      email,
      password
    });

    return response.sendStatus(Successful.CREATED);
  } catch (error) {
    console.log("Error", error instanceof Error);
    next(error);
  }
}
