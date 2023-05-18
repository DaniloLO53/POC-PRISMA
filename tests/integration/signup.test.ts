import supertest from "supertest";
import { faker } from "@faker-js/faker";
import { cleanDb, validatePassword } from "../helpers";
import app, { init } from "@/app";
import { prisma } from "@/config";

const server = supertest(app);

describe("POST /sign-up", () => {
  beforeAll(async () => await init());

  afterEach(async () => {
    await cleanDb();
  });

  it("should return 422 if password is not following schema", async () => {
    const password = faker.internet.password(5);
    const response = await server
      .post("/sign-up")
      .send({
        email: faker.internet.email(),
        password,
        confirmPassword: password,
      });
    
    expect(response.statusCode).toBe(422);
  });

  it("should return 422 if email is not following schema", async () => {
    const password = faker.internet.password(5);
    const response = await server
      .post("/sign-up")
      .send({
        email: "test.com",
        password,
        confirmPassword: password,
      });
    
    expect(response.statusCode).toBe(422);
  });

  it("should return 400 if confirmPassword does not match with password", async () => {
    const password = faker.internet.password(6);
    const response = await server
      .post("/sign-up")
      .send({
        email: faker.internet.email(),
        password,
        confirmPassword: password + " ",
      });
    
    expect(response.statusCode).toBe(422);
  });

  it("should return 409 if email is already registered", async () => {
    const email = faker.internet.email();
    const password = faker.internet.password(6);
    
    await server
      .post("/sign-up")
      .send({
        email,
        password,
        confirmPassword: password
      });
    const response2 = await server
      .post("/sign-up")
      .send({
        email,
        password,
        confirmPassword: password
      });

    expect(response2.statusCode).toBe(409);
  });

  it("should not store unhashed password into db", async () => {
    const password = faker.internet.password();
    const email = faker.internet.email();

    const response = await server
      .post("/sign-up")
      .send({
        email,
        password,
        confirmPassword: password,
      });
    const user = await prisma.user.findFirst({
      where: {
        email,
      }
    });
    const validation = await validatePassword(password, user?.password as string);
    
    expect(validation).toBe(true);
    expect(user?.password).not.toBe(response.body.password);
  });

  it("should return 201 and create user", async () => {
    const password = faker.internet.password(6);
    const email = faker.internet.email();

    const response = await server
      .post("/sign-up")
      .send({
        email,
        password,
        confirmPassword: password,
      });
    const user = await prisma.user.findFirst({
      where: {
        email,
      }
    });

    expect(user?.email).not.toBe(response.body.email);
    expect(response.statusCode).toBe(201);
  });
});
