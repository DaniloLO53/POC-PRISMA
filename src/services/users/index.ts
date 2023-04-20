import { duplicatedUserError } from "@/errors/duplicatedUser.errors";
import usersRepository from "@/repositories/users";
import { IUserData } from "@/schemas";

export async function getAllUsers() {
  const users = await usersRepository.findAll();

  return users;
}

export async function postUser(data: IUserData): Promise<void> {
  const { email } = data;

  const user = await usersRepository.findUnique(email);

  console.log("User", user);

  if (user) throw duplicatedUserError();

  await usersRepository.create(data);
}

const usersService = {
  getAllUsers,
  postUser
};

export default usersService;
