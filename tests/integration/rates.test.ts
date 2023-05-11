import { faker } from "@faker-js/faker";
import supertest from "supertest";
import { mockCreateUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import { prisma } from "@/config";
import app, { close, init } from "@/app";

type ServerType = supertest.SuperTest<supertest.Test>; 
const server: ServerType= supertest(app);

describe("Comments test suite", () => {
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
        post_id: Number(faker.random.numeric())
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
        post_id: resultPost.body.data.id
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
        post_id: resultPost.body.data.id
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
        post_id: resultPost.body.data.id
      });
    const resultRating2 = await server
      .post("/posts/rating")
      .set({ "Authorization": token1 })
      .send({
        type: "DISLIKE",
        post_id: resultPost.body.data.id
      });
    const likesCount = await prisma.postRating.count({
      where: {
        post_id: resultPost.body.data.id,
        type: "LIKE"
      }
    });
    const dislikesCount = await prisma.postRating.count({
      where: {
        post_id: resultPost.body.data.id,
        type: "DISLIKE"
      }
    });

    expect(resultRating1.statusCode).toBe(expectedCode);
    expect(resultRating2.statusCode).toBe(expectedCode);
    expect(dislikesCount).toBe(1);
    expect(likesCount).toBe(1);
  });

  it("should return return 200 when get post ratings", async () => {
    const expectedCode = 200;
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
    await server
      .post("/posts/rating")
      .set({ "Authorization": token1 })
      .send({
        type: "LIKE",
        post_id: resultPost.body.data.id
      });
    await server
      .post("/posts/rating")
      .set({ "Authorization": token1 })
      .send({
        type: "DISLIKE",
        post_id: resultPost.body.data.id
      });
    const resultPostRating = await server
      .get(`/posts/${resultPost.body.data.id}/ratings`)
      .set({ "Authorization": token1 });
    const likesCount = resultPostRating.body.data
      .filter(({ type }: {type: "LIKE" | "DISLIKE"}) => type === "LIKE").length;
    const dislikesCount = resultPostRating.body.data
      .filter(({ type }: {type: "LIKE" | "DISLIKE"}) => type === "DISLIKE").length;

    expect(resultPostRating.body.data.length).toBe(2);
    expect(likesCount).toBe(1);
    expect(dislikesCount).toBe(1);
    expect(resultPostRating.statusCode).toBe(expectedCode);
  });

  it("should return return quantity of post ratings", async () => {
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
    await server
      .post("/posts/rating")
      .set({ "Authorization": token1 })
      .send({
        type: "LIKE",
        post_id: resultPost.body.data.id
      });
    await server
      .post("/posts/rating")
      .set({ "Authorization": token1 })
      .send({
        type: "DISLIKE",
        post_id: resultPost.body.data.id
      });
    const resultPostRatingCount = await server
      .get(`/posts/${resultPost.body.data.id}/ratings/count`)
      .set({ "Authorization": token1 });

    expect(resultPostRatingCount.body.data.ratingsQuantity).toBe(2);
  });

  

  it("should return return 201 when comment is rated", async () => {
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
        post_id: resultPost.body.data.id
      });
    const resultRating1 = await server
      .post("/posts/comments/rating")
      .set({ "Authorization": token1 })
      .send({
        type: "LIKE",
        comment_id: resultComment.body.data.id
      });
    const resultRating2 = await server
      .post("/posts/comments/rating")
      .set({ "Authorization": token1 })
      .send({
        type: "DISLIKE",
        comment_id: resultComment.body.data.id
      });
    const likesCount = await prisma.commentRating.count({
      where: {
        comment_id: resultComment.body.data.id,
        type: "LIKE"
      }
    });
    const dislikesCount = await prisma.commentRating.count({
      where: {
        comment_id: resultComment.body.data.id,
        type: "DISLIKE"
      }
    });

    expect(resultRating1.statusCode).toBe(expectedCode);
    expect(resultRating2.statusCode).toBe(expectedCode);
    expect(dislikesCount).toBe(1);
    expect(likesCount).toBe(1);
  });

  it("should return return 200 when get comment ratings", async () => {
    const expectedCode = 200;
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
        post_id: resultPost.body.data.id
      });
    await server
      .post("/posts/comments/rating")
      .set({ "Authorization": token1 })
      .send({
        type: "LIKE",
        comment_id: resultComment.body.data.id
      });
    await server
      .post("/posts/comments/rating")
      .set({ "Authorization": token1 })
      .send({
        type: "DISLIKE",
        comment_id: resultComment.body.data.id
      });
    const resultCommentRating = await server
      .get(`/posts/comments/${resultComment.body.data.id}/ratings`)
      .set({ "Authorization": token1 });

    expect(resultCommentRating.body.data.length).toBe(2);
    expect(resultCommentRating.statusCode).toBe(expectedCode);
  });

  it("should return return quantity of comment ratings", async () => {
    const expectedCode = 200;
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
        post_id: resultPost.body.data.id
      });
    await server
      .post("/posts/comments/rating")
      .set({ "Authorization": token1 })
      .send({
        type: "LIKE",
        comment_id: resultComment.body.data.id
      });
    await server
      .post("/posts/comments/rating")
      .set({ "Authorization": token1 })
      .send({
        type: "DISLIKE",
        comment_id: resultComment.body.data.id
      });
    const resultCommentRatingCount = await server
      .get(`/posts/comments/${resultComment.body.data.id}/ratings/count`)
      .set({ "Authorization": token1 });

    expect(resultCommentRatingCount.body.data.ratingsQuantity).toBe(2);
    expect(resultCommentRatingCount.statusCode).toBe(expectedCode);
  });
});
describe("GET comments", () => {
  it("should ", () => {
    expect(1).toBe(1);
  });
});

