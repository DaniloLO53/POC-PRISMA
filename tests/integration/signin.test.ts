import supertest from "supertest";
import { faker } from "@faker-js/faker";
import { JwtPayload } from "jsonwebtoken";
import { cleanDb, JWTUserData } from "../helpers";
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

  it("should return 401 if password is not correct", async () => {
    const password = faker.internet.password(6);
    const usersData = {
      email: faker.internet.email(),
      password,
      confirmPassword: password
    };

    await server
      .post("/sign-up")
      .send(usersData);

    const response = await server
      .post("/sign-in")
      .send({
        email: usersData.email,
        password: faker.internet.password(6)
      });
    
    expect(response.statusCode).toBe(401);
  });

  it("should return correct token after login", async () => {
    const password = faker.internet.password(6);
    const userData = {
      email: faker.internet.email(),
      password,
      confirmPassword: password
    };

    await server
      .post("/sign-up")
      .send(userData);

    const response = await server
      .post("/sign-in")
      .send({
        email: userData.email,
        password: userData.password
      });

    const {
      email: JWTEmail,
      password: JWTPassword
    } = JWTUserData(response.body.token) as JwtPayload;
    
    expect(JWTEmail).toBe(userData.email);
    expect(JWTPassword).toBe(userData.password);
    expect(typeof response.body.token).toBe("string");
  });
});
