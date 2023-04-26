import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { IUserData } from "@/users/schemas";
import { prisma } from "@/config";

export async function mockCreateUser(userData: IUserData): Promise<User> {
  const hashedPassword = await bcrypt.hash(userData.password, 12);

  return prisma.user.create({
    data: { ...userData, password: hashedPassword }
  });
}
