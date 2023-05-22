import * as jwt from "jsonwebtoken";
import dotenv from"dotenv";
import { User } from "@prisma/client";
import bycript from "bcrypt";
import { User as IUser } from "@/interfaces/users";
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

export function JWTUserData(token: string) {
  const userData = jwt.verify(token, process.env.JWT_SECRET as string);

  return userData;
}

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email
    }
  });
}

export async function verifyJWTHasPassword(JWTUser: jwt.JwtPayload, userData: IUser) {
  const { password: dbPassword } = await findUserByEmail(userData.email) as User;
  let hasPassword = false;

  for (const value in JWTUser) {
    if (value === "iat") continue;
    const comparePasswords = await validatePassword(JWTUser[value], dbPassword);

    if (comparePasswords) hasPassword = comparePasswords;
  }

  return hasPassword;
}

export function extractTokenFromCookies(cookies: string[]) {
  const [cookie] = cookies;
  const [tokenEntry] = cookie.split(";");
  const [tokenKey, tokenValue] = tokenEntry.split("=");

  return {
    tokenKey,
    tokenValue
  };
}
