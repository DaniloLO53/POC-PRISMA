import supertest from "supertest";
import { faker } from "@faker-js/faker";
import { cleanDb } from "../helpers";
import app, { init } from "@/app";

const server = supertest(app);

beforeAll(async () => init());
afterEach(async () => cleanDb());

describe("POST /sign-in", () => {
  it("should return 422 if data is not valid", async () => {
    const response = await server
      .post("/sign-in")
      .send({
        password: faker.internet.password(),
      });

    expect(response.statusCode).toBe(422);
  });
  it("should return 401 if user's email is not found ", async () => {
    const response = await server
      .post("/sign-in")
      .send({
        email: faker.internet.email(),
        password: faker.internet.password(),
      });

    expect(response.statusCode).toBe(401);
  });
});
