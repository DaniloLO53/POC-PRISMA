import { NextFunction, Request, Response } from "express";
import userService from "@/services/users";
import { Successful } from "@/utils/statusCodes/successful";

export async function usersPost(
  request: Request, response: Response, next: NextFunction
) {
  const { name, password, email } = request.body;

  try {
    await userService.createUser({ name, password, email });
    return response.sendStatus(Successful.CREATED);
  } catch(error) {
    next(error);
  }
}
