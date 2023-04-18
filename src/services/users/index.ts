import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { IUserProperties } from "@/services/interfaces/IUsersProperties";
import userRepository from "@/repositories/users.repositories";
import { duplicatedUserError } from "@/errors/duplicatedUser.errors";

async function createUser(
  { email, password, name }: IUserProperties
): Promise<User> {
  const userWithSameEmail = await userRepository.findByEmail(email);

  if (userWithSameEmail) throw duplicatedUserError();

  const hashedPassword = await bcrypt.hash(password, 12);

  return userRepository.create({
    name,
    email,
    password: hashedPassword,
  });
}

export default {
  createUser
};
