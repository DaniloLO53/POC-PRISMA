import { faker } from "@faker-js/faker";
import supertest from "supertest";
import { cleanDb } from "../helpers";
import app, { init } from "@/app";
import { IUserData } from "@/schemas";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("Schema from data user", () => {
  const generateValidUserData = () => ({
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    birth: "29-05-1996",
    email: faker.internet.email(
      (this as IUserData).first_name,
      (this as IUserData).last_name
    ),
    password: faker.internet.password()
  });

  it("should return 422 when first_name or last_name is invalid", async () => {
    const expectedCode = 422;
    const validInput = generateValidUserData();
    const invalidNames = [
      "",
      42,
      { name: "hello" },
      null,
      undefined,
      true,
      false,
    ];
    const  invalidDatas = invalidNames.map((name) => (
      { ...validInput, first_name: name, last_name: name })
    );
    const promisses = invalidDatas.map((data) => server.post("/users").send(data));

    await Promise.all(promisses)
      .then((values) =>
        values.forEach(({ status }) => expect(status).toBe(expectedCode))
      );
  });
});

