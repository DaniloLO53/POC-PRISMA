import supertest from "supertest";
import { faker } from "@faker-js/faker";
import { cleanDb } from "../helpers";
import app, { close, init } from "@/app";
import { IUserData } from "@/schemas";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

afterAll(async () => {
  await close();
});

describe("CRUD on users", () => {
  describe("GET /users", () => {
    it("should return 200 to status code", async () => {
      const expectedCode = 200;
      const result = await server.get("/users");
  
      expect(result.status).toBe(expectedCode);
    });
  });

  describe("POST /users/sign-up", () => {
    it("should return 201 when user is created succesfully", async () => {
      const expectedCode = 201;
      const userData = {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        birth: "29-05-1996",
        email: faker.internet.email(
          (this as unknown as IUserData).first_name,
          (this as unknown as IUserData).last_name
        ),
        password: faker.internet.password()
      };
      const result = await server.post("/users/sign-up").send(userData);

      expect(result.status).toBe(expectedCode);
    });
  });
});
