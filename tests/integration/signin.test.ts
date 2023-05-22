import supertest from "supertest";
import { faker } from "@faker-js/faker";
import { JwtPayload } from "jsonwebtoken";
import { User } from "@prisma/client";
import { cleanDb, findUserByEmail, JWTUserData, verifyJWTHasPassword } from "../helpers";
import app, { init } from "@/app";
import { validatePassword } from "@/helpers/hashPassword";

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

  it("should return correct token after login, without storing password", async () => {
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
    const JWTUser = JWTUserData(response.body.token) as JwtPayload;

    const hasPassword = await verifyJWTHasPassword(JWTUser, userData);

    expect(JWTUser.email).toBe(userData.email);
    expect(hasPassword).toBe(false);
    expect(typeof response.body.token).toBe("string");
    expect(response.statusCode).toBe(201);
  });
});
