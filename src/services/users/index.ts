import bcrypt from "bcrypt";
import { duplicatedUserError } from "@/errors/duplicatedUser.errors";
import usersRepository from "@/repositories/users";
import { IUserData } from "@/schemas";

export async function getAllUsers() {
  const users = await usersRepository.findAll();

  return users;
}

export async function postUser(data: IUserData): Promise<void> {
  const { email, password } = data;

  const user = await usersRepository.findUnique(email);

  if (user) throw duplicatedUserError();

  const hashedPassword = await bcrypt.hash(password, 12);

  await usersRepository.create({ ...data, password: hashedPassword });
}

const usersService = {
  getAllUsers,
  postUser
};

export default usersService;
