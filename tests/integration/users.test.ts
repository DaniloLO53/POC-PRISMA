import supertest from "supertest";
import { faker } from "@faker-js/faker";
import { User } from "@prisma/client";
import { cleanDb, generateValidToken } from "../helpers";
import { mockCreateUser } from "../factories";
import app, { close, init } from "@/app";
import usersRepository from "@/repositories/users";



const server = supertest(app);

describe("CRUD on users", () => {
  const createUserData = () => {
    const first_name = faker.name.firstName();
    const last_name = faker.name.lastName();
    const birth = "29-05-1996";
    const email = faker.internet.email(first_name, last_name);
    const password = faker.internet.password();

    return {
      first_name,
      last_name,
      birth,
      email,
      password
    };
  };

  beforeAll(async () => {
    await init();
  });

  // beforeEach(async () => {
  //   // await cleanDb();
  // });
  
  afterEach(async () => {
    await cleanDb();
    await close();
  });

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
      const user = createUserData();
      const result = await server.post("/users/sign-up").send(user);

      expect(result.status).toBe(expectedCode);
    });

    it("should save user on db when user is created succesfully", async () => {
      const user = createUserData();
      await mockCreateUser(user);

      const userFound = await usersRepository.findUnique(user.email);
      
      expect(userFound).not.toBeNull();
    });
  });

  describe("POST /users/sign-in", () =>  {  
    const user = createUserData();
    
    it("it should return 201 when user is logged in", async () => {
      const expectedCode = 201;
      await mockCreateUser(user);

      const signinUserData = {
        password: user.password,
        email: user.email,
      };

      const result = await server.post("/users/sign-in").send(signinUserData);

      expect(result.status).toBe(expectedCode);
    });

    it("it should return 404 when password or email is incorrect", async () => {
      const expectedCode = 404;
      const invalidPasswordSigninUserData = {
        password: faker.internet.password(),
        email: user.email,
      };
      const invalidEmailSigninUserData = {
        password: faker.internet.password(),
        email: faker.internet.email(),
      };

      const resultWithInvalidEmail = await server
        .post("/users/sign-in")
        .send(invalidEmailSigninUserData);
      const resultWithInvalidPassword = await server
        .post("/users/sign-in")
        .send(invalidPasswordSigninUserData);

      expect(resultWithInvalidEmail.status).toBe(expectedCode);
      expect(resultWithInvalidPassword.status).toBe(expectedCode);
    });
  });

  describe("Followings", () => {
    const userData1 = createUserData();
    const userData2 = createUserData();

    it("should return 201 when user is followed successfully", async () => {
      await mockCreateUser(userData1);
      const user2 = await mockCreateUser(userData2);

      const expectedCode = 201;
      const token = await generateValidToken(user2);

      const { id } = await usersRepository.findUnique(userData2.email) as User;

      const result = await server
        .post("/users/relashionship")
        .set({ "Authorization": token })
        .send({ follow: true, idFromFollowed: id });
  
      expect(result.status).toBe(expectedCode);
    });

    it("should return 409 when user is already followed", async () => {
      await mockCreateUser(userData1);
      const user2 = await mockCreateUser(userData2);

      const expectedCode = 409;
      const token = await generateValidToken(user2);

      const { id } = await usersRepository.findUnique(userData2.email) as User;

      await server
        .post("/users/relashionship")
        .set({ "Authorization": token })
        .send({ follow: true, idFromFollowed: id });
      const result = await server
        .post("/users/relashionship")
        .set({ "Authorization": token })
        .send({ follow: true, idFromFollowed: id });
  
      expect(result.status).toBe(expectedCode);
    });

    it("should return 409 when user is already unfollowed", async () => {
      await mockCreateUser(userData1);
      const user2 = await mockCreateUser(userData2);

      const expectedCode = 409;
      const token = await generateValidToken(user2);

      const { id } = await usersRepository.findUnique(userData2.email) as User;

      const result = await server
        .post("/users/relashionship")
        .set({ "Authorization": token })
        .send({ follow: false, idFromFollowed: id });
  
      expect(result.status).toBe(expectedCode);
    });
  });
});
