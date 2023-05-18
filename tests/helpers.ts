import * as jwt from "jsonwebtoken";
import dotenv from"dotenv";
import { User } from "@prisma/client";
import bycript from "bcrypt";
import { prisma } from "@/config";

dotenv.config();

export async function cleanDb() {
  await prisma.commentRating.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.postRating.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.relationship.deleteMany({});
  await prisma.user.deleteMany({});
}

export function hashPassword(password: string) {
  const hashedPassword = bycript.hash(password, 10);

  return hashedPassword;
}

export function validatePassword(password: string, dbPassword: string) {
  return bycript.compare(password, dbPassword);
}

export async function generateValidToken(user: User) {
  const token = jwt.sign({ user }, process.env.JWT_SECRET as string);

  return `Bearer ${token}`;
}
