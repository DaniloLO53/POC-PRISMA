import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { duplicatedUserError } from "@/errors/duplicatedUser.errors";
import { IUserData } from "@/schemas";
import { userNotFoundError } from "@/errors/notFound.errors";
import usersRepository from "@/repositories/users";
import { alreadyFollowing } from "@/errors/alreadyFollowing.errors";
import { notFollowing } from "@/errors/notFollowing.errors";

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
  userData: Pick<IUserData, SignInData>
): Promise<string> {
  const secret = process.env.JWT_SECRET || "secret";
  const expiresIn = "3d";

  const user = await usersRepository.findUnique(userData.email);
  const passwordIsValid = user && await bcrypt.compare(userData.password, user.password);

  if (!user || !passwordIsValid) throw userNotFoundError();

  const token = jwt.sign({ user }, secret, { expiresIn });

  return token;
}

export async function createOrDestroyRelashionship({
  idFromFollowed, idFromFollower, follow
}: IRelashionshipDTO): Promise<void> {
  const usersFolloweds = await usersRepository.findFolloweds(idFromFollower);
  const isFollowing = usersFolloweds.includes(idFromFollowed);

  if (follow && isFollowing) {
    throw alreadyFollowing();
  } else if (!follow && !isFollowing) {
    throw notFollowing();
  }

  await usersRepository.createOrDestroyRelashionship({
    idFromFollowed,
    idFromFollower,
    follow
  });
}

type SignInData = "email" | "password";

export interface IRelashionshipDTO {
  follow: boolean;
  idFromFollowed: number,
  idFromFollower: number
}

const usersService = {
  getAllUsers,
  signUp,
  signIn,
  createOrDestroyRelashionship
};

export default usersService;
