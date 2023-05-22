import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { duplicatedUserError } from "@/errors/duplicatedUser.errors";
import { passwordUnmatchError } from "@/errors/passwordUnmatch.errors";
import { unauthorizedError } from "@/errors/unauthorizedError.errors";
import { hashPassword, validatePassword } from "@/helpers/hashPassword";
import { User } from "@/interfaces/users";
import usersRepositories from "@/repositories/users";

dotenv.config();

async function checkEmailAndPassword({ email, password }: Omit<User, "confirmPassword">) {
  const dbUser = await usersRepositories.findUserByEmail(email);
  if (!dbUser) throw unauthorizedError();

  const passwordVerify = await validatePassword(password, dbUser.password);
  if (!passwordVerify) throw unauthorizedError();
}

export async function signup({ email, password, confirmPassword }: User) {
  // double check - it was already checked on schema
  if (password !== confirmPassword) throw passwordUnmatchError();

  const dbUser = await usersRepositories.findUserByEmail(email);
  
  if (dbUser) throw duplicatedUserError();

  const hashedPassword = await hashPassword(password);
  
  return await usersRepositories.createUser({ email, password: hashedPassword });
}

export async function signin({ email, password }: Omit<User, "confirmPassword">) {
  await checkEmailAndPassword({ email, password });

  const token = jwt.sign({ email, password }, process.env.JWT_SECRET as string);

  return {
    token
  };
}

const usersServices = {
  signup,
  signin
};

export default usersServices;
