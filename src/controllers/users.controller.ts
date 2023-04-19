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
