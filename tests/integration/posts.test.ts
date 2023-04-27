import supertest from "supertest";
import { faker } from "@faker-js/faker";
import { cleanDb, generateValidToken } from "../helpers";
import { mockCreateUser } from "../factories";
import app, { close, init } from "@/app";
import { prisma } from "@/config";

type ServerType = supertest.SuperTest<supertest.Test>; 
const server: ServerType= supertest(app);

describe("User's posts", () => {
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
  
  afterEach(async () => {
    await cleanDb();
    await close();
  });

  it("should return return 401 whe token is invalid or not setted", async () => {
    const expectedCode = 401;
    const userData = createUserData();
    await mockCreateUser(userData);

    const result1 = await server
      .post("/posts")
      .set({ "Authorization": "token" })
      .send({
        content: faker.lorem.text(),
        movie_imdb: "tt1234567"
      });
    const result2 = await server
      .post("/posts")
      .send({
        content: faker.lorem.text(),
        movie_imdb: "tt1234567"
      });

    expect(result1.statusCode).toBe(expectedCode);
    expect(result2.statusCode).toBe(expectedCode);
  });

  it("should return return 422 when data is invalid", async () => {
    const expectedCode = 422;
    const userData = createUserData();
    const user = await mockCreateUser(userData);

    const token = await generateValidToken(user);
    const result1 = await server
      .post("/posts")
      .set({ "Authorization": token })
      .send({
        content: faker.lorem.text(),
        movie_imdb: "tt123456"
      });
    const result2 = await server
      .post("/posts")
      .set({ "Authorization": token })
      .send({
        content: 42,
        movie_imdb: "tt1234567"
      });

    expect(result1.statusCode).toBe(expectedCode);
    expect(result2.statusCode).toBe(expectedCode);
  });

  it("should return return 401 when trying to update post from others", async () => {
    const expectedCode = 401;
    const userData1 = createUserData();
    const userData2 = createUserData();
    const user1 = await mockCreateUser(userData1);
    const user2 = await mockCreateUser(userData2);

    const token1 = await generateValidToken(user1);
    const token2 = await generateValidToken(user2);

    const resultPost = await server
      .post("/posts")
      .set({ "Authorization": token1 })
      .send({
        content: faker.lorem.text(),
        movie_imdb: "tt1234567"
      });
    const resultUpdate = await server
      .put(`/posts/${String(resultPost.body.id)}`)
      .set({ "Authorization": token2 })
      .send({
        content: faker.lorem.text(),
        movie_imdb: "tt1234567"
      });

    expect(resultUpdate.statusCode).toBe(expectedCode);
  });

  it("should return return 409 when post is not found", async () => {
    const expectedCode = 409;
    const userData1 = createUserData();
    const user1 = await mockCreateUser(userData1);

    const token1 = await generateValidToken(user1);

    await server
      .post("/posts")
      .set({ "Authorization": token1 })
      .send({
        content: faker.lorem.text(),
        movie_imdb: "tt1234567"
      });
    const resultUpdate = await server
      .put(`/posts/${String(faker.random.numeric())}`)
      .set({ "Authorization": token1 })
      .send({
        content: faker.lorem.text(),
        movie_imdb: "tt1234567"
      });

    expect(resultUpdate.statusCode).toBe(expectedCode);
  });

  it("should return return 201 when post is updated", async () => {
    const expectedCode = 201;
    const userData1 = createUserData();
    const user1 = await mockCreateUser(userData1);

    const token1 = await generateValidToken(user1);
    const dataToUpdate = {
      content: faker.lorem.text(),
      movie_imdb: "tt1234567"
    };

    const resultPost = await server
      .post("/posts")
      .set({ "Authorization": token1 })
      .send({
        content: faker.lorem.text(),
        movie_imdb: "tt1234567"
      });
    const resultUpdate = await server
      .put(`/posts/${String(resultPost.body.id)}`)
      .set({ "Authorization": token1 })
      .send(dataToUpdate);

    expect(resultUpdate.statusCode).toBe(expectedCode);
    expect(resultUpdate.body).toMatchObject(dataToUpdate);
  });

  it("should return return 201 when post is created", async () => {
    const expectedCode = 201;
    const userData1 = createUserData();
    const user1 = await mockCreateUser(userData1);

    const token1 = await generateValidToken(user1);
    const dataSent = {
      content: faker.lorem.text(),
      movie_imdb: "tt1234567"
    };

    const resultPost = await server
      .post("/posts")
      .set({ "Authorization": token1 })
      .send(dataSent);

    expect(resultPost.statusCode).toBe(expectedCode);
    expect(resultPost.body).toMatchObject(dataSent);
  });

  it("should return return 409 when post rated not found", async () => {
    const expectedCode = 409;
    const userData1 = createUserData();
    const user1 = await mockCreateUser(userData1);

    const token1 = await generateValidToken(user1);

    const resultRating = await server
      .post("/posts/rating")
      .set({ "Authorization": token1 })
      .send({
        type: "LIKE",
        post_id: faker.random.numeric()
      });

    expect(resultRating.statusCode).toBe(expectedCode);
  });

  it("should return return 422 when invalid post rated data", async () => {
    const expectedCode = 422;
    const userData1 = createUserData();
    const user1 = await mockCreateUser(userData1);

    const token1 = await generateValidToken(user1);

    const resultPost = await server
      .post("/posts")
      .set({ "Authorization": token1 })
      .send({
        content: faker.lorem.text(),
        movie_imdb: "tt1234567"
      });
    const resultRating = await server
      .post("/posts/rating")
      .set({ "Authorization": token1 })
      .send({
        type: faker.lorem.word(),
        post_id: resultPost.body.id
      });

    expect(resultRating.statusCode).toBe(expectedCode);
  });

  it("should return return 201 when post is rated", async () => {
    const expectedCode = 201;
    const userData1 = createUserData();
    const user1 = await mockCreateUser(userData1);

    const token1 = await generateValidToken(user1);

    const resultPost = await server
      .post("/posts")
      .set({ "Authorization": token1 })
      .send({
        content: faker.lorem.text(),
        movie_imdb: "tt1234567"
      });
    const resultRating1 = await server
      .post("/posts/rating")
      .set({ "Authorization": token1 })
      .send({
        type: "LIKE",
        post_id: resultPost.body.id
      });
    const resultRating2 = await server
      .post("/posts/rating")
      .set({ "Authorization": token1 })
      .send({
        type: "DISLIKE",
        post_id: resultPost.body.id
      });
    const likesCount = await prisma.postRating.count({
      where: {
        post_id: resultPost.body.id,
        type: "LIKE"
      }
    });
    const dislikesCount = await prisma.postRating.count({
      where: {
        post_id: resultPost.body.id,
        type: "DISLIKE"
      }
    });

    expect(resultRating1.statusCode).toBe(expectedCode);
    expect(resultRating2.statusCode).toBe(expectedCode);
    expect(dislikesCount).toBe(1);
    expect(likesCount).toBe(1);
  });

  it("should return return 409 when post to be commented is not found", async () => {
    const expectedCode = 409;
    const userData1 = createUserData();
    const user1 = await mockCreateUser(userData1);

    const token1 = await generateValidToken(user1);

    const resultComment = await server
      .post("/posts/comments")
      .set({ "Authorization": token1 })
      .send({
        content: faker.lorem.paragraphs(),
        post_id: faker.random.numeric()
      });

    expect(resultComment.statusCode).toBe(expectedCode);
  });

  it("should return return 422 when invalid post comment data", async () => {
    const expectedCode = 422;
    const userData1 = createUserData();
    const user1 = await mockCreateUser(userData1);

    const token1 = await generateValidToken(user1);

    const resultPost = await server
      .post("/posts")
      .set({ "Authorization": token1 })
      .send({
        content: faker.lorem.text(),
        movie_imdb: "tt1234567"
      });
    const resultComment = await server
      .post("/posts/comments")
      .set({ "Authorization": token1 })
      .send({
        content: 42,
        post_id: resultPost.body.id
      });

    expect(resultComment.statusCode).toBe(expectedCode);
  });

  it("should return return 201 when post is commented", async () => {
    const expectedCode = 201;
    const userData1 = createUserData();
    const user1 = await mockCreateUser(userData1);

    const token1 = await generateValidToken(user1);

    const resultPost = await server
      .post("/posts")
      .set({ "Authorization": token1 })
      .send({
        content: faker.lorem.text(),
        movie_imdb: "tt1234567"
      });
    const resultComment = await server
      .post("/posts/comments")
      .set({ "Authorization": token1 })
      .send({
        content: faker.lorem.paragraphs(),
        post_id: resultPost.body.id
      });
    const commentsCount = await prisma.comment.count({
      where: {
        post_id: resultPost.body.id,
      }
    });

    expect(resultComment.statusCode).toBe(expectedCode);
    expect(commentsCount).toBe(1);
  });
});
