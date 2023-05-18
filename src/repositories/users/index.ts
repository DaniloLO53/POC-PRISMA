import { User } from "@prisma/client";
import { prisma } from "@/config";
import { User as IUser } from "@/interfaces/users";

export async function createUser({ email, password }: Omit<IUser, "confirmPassword">) {
  return prisma.user.create({
    data: {
      email, password
    }
  });
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: {
      email
    }
  });
}

const usersRepositories = {
  createUser,
  findUserByEmail,
};

export default usersRepositories;
