import { faker } from "@faker-js/faker";
import { mockCreateUser } from "../factories";
import { cleanDb } from "../helpers";
import usersService  from "@/services/users";
import { IUserData } from "@/schemas";
import { init } from "@/app";

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

  it("should returns OK", () => expect("OK").toBe("OK"));

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
});
