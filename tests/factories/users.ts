import { User } from "@prisma/client";
import { IUserData } from "@/schemas";
import { prisma } from "@/config";

export function mockCreateUser(userData: IUserData): Promise<User> {
  return prisma.user.create({
    data: userData
  });
}
