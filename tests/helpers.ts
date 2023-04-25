import * as jwt from "jsonwebtoken";
import dotenv from"dotenv";
import { User } from "@prisma/client";
import { prisma } from "@/config";

dotenv.config();

export async function cleanDb() {
  await prisma.relationship.deleteMany({});
  await prisma.user.deleteMany({});
}

export async function generateValidToken(user: User) {
  const token = jwt.sign({ user }, process.env.JWT_SECRET as string);

  return `Bearer ${token}`;
}
