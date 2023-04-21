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
  const generalInvalidTypes = [
    "",
    42,
    { name: "hello" },
    null,
    undefined,
    true,
    false,
    new Date("29-05-1995")
  ];

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

  it("should return 422 when data types are invalid", async () => {
    const expectedCode = 422;
    const generalInvalidTypes = ["", null, undefined, [], {}];
  
    for (const name of generalInvalidTypes) {
      const data = {
        birth: name,
        email: name,
        password: name,
        first_name: name,
        last_name: name
      };
      const response = await server.post("/users").send(data);
      expect(response.status).toBe(expectedCode);
    }
  });

  it("should return 422 when email is invalid", async () => {
    const expectedCode = 422;
    const validData = generateValidUserData();
    const invalidEmails = [
      "dan@@gmail.com",
      "dangmail.com",
      "dan@gmailcom",
      "@dan@gmail.com",
      ".dan@gmail.com",
      "dangmailcom",
      "dan@ gmail.com",
    ];

    for (const email of invalidEmails) {
      const data = { ...validData, email };
      const response = await server.post("/users").send(data);
      expect(response.status).toBe(expectedCode);
    }
  });
});

