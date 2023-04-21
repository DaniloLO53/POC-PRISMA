import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { mockCreateUser } from "../factories";
import { cleanDb } from "../helpers";
import usersService  from "@/services/users";
import { IUserData } from "@/schemas";
import { init } from "@/app";
import { prisma } from "@/config";

beforeAll(async () => {
  await init();
  await cleanDb();
});

describe("Services from user", () => {
  const generateValidUserData = () => ({
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    birth: "29-05-1996",
    email: faker.internet.email(
      (this as unknown as IUserData).first_name,
      (this as unknown as IUserData).last_name
    ),
    password: faker.internet.password()
  });

  it("should return 409 when user with the same email is already registered",
    async () => {
      const userData = generateValidUserData();
      await mockCreateUser(userData);

      try {
        const newUser = generateValidUserData();
        const duplicatedUser = { ...newUser, email: userData.email };
        
        await usersService.postUser(duplicatedUser);

        fail("it should throw duplicatedUserError");
      } catch (error) {
        expect(error.message).toBe("Email already registered");
      }
    });

  it("should encrypt password", async () => {
    const userData = generateValidUserData();
    await mockCreateUser(userData);

    const user = await prisma.user.findUnique({
      where: { email: userData.email }
    }) as User;

    expect(user.password).not.toBe(userData.password);
    expect(await bcrypt.compare(userData.password, user.password)).toBe(true);
  });
});
