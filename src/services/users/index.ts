import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { duplicatedUserError } from "@/errors/duplicatedUser.errors";
import usersRepository from "@/repositories/users";
import { IUserData } from "@/schemas";
import { userNotFoundError } from "@/errors/notFound.errors";

dotenv.config();

export async function getAllUsers() {
  const users = await usersRepository.findAll();

  return users;
}

export async function signUp(data: IUserData): Promise<void> {
  const { email, password } = data;

  const user = await usersRepository.findUnique(email);

  if (user) throw duplicatedUserError();

  const hashedPassword = await bcrypt.hash(password, 12);

  await usersRepository.create({ ...data, password: hashedPassword });
}

export async function signIn(
  data: Pick<IUserData, "email" | "password">
): Promise<string> {
  const { email, password } = data;
  const expiresIn = "3d";
  const key = process.env.JWT_KEY || "key";

  const user = await usersRepository.findUnique(email);
  const passwordIsValid = user && await bcrypt.compare(password, user.password);

  if (!user || !passwordIsValid) throw userNotFoundError();

  const token = jwt.sign({ user }, key, { expiresIn });

  return token;
}

const usersService = {
  getAllUsers,
  signUp,
  signIn
};

export default usersService;
