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
      .put(`/posts/${String(resultPost.body.data.id)}`)
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
      .put(`/posts/${String(resultPost.body.data.id)}`)
      .set({ "Authorization": token1 })
      .send(dataToUpdate);

    expect(resultUpdate.statusCode).toBe(expectedCode);
    expect(resultUpdate.body.data).toMatchObject(dataToUpdate);
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
    expect(resultPost.body.data).toMatchObject(dataSent);
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
        post_id: resultPost.body.data.id
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
        post_id: resultPost.body.data.id
      });

    const commentsCount = await prisma.comment.count({
      where: {
        post_id: resultPost.body.data.id,
      }
    });

    expect(resultComment.statusCode).toBe(expectedCode);
    expect(commentsCount).toBe(1);
  });

  it("should return return 201 when comment is commented", async () => {
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

    await server
      .post("/posts/comments")
      .set({ "Authorization": token1 })
      .send({
        content: faker.lorem.paragraphs(),
        post_id: resultPost.body.data.id,
        comment_id: resultComment.body.data.id
      });
    
    const postCommentsCount = await prisma.comment.count({
      where: {
        post_id: resultPost.body.data.id,
      }
    });
    const commentsToCommentCount = await prisma.comment.count({
      where: {
        post_id: resultPost.body.data.id,
        comment_id: resultComment.body.data.id
      }
    });

    expect(resultComment.statusCode).toBe(expectedCode);
    expect(postCommentsCount).toBe(2);
    expect(commentsToCommentCount).toBe(1);
  });

  it("should return return 200 when get post comments", async () => {
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
      .post("/posts/comments")
      .set({ "Authorization": token1 })
      .send({
        content: faker.lorem.paragraphs(),
        post_id: resultPost.body.data.id,
      });
    await server
      .post("/posts/comments")
      .set({ "Authorization": token1 })
      .send({
        content: faker.lorem.paragraphs(),
        post_id: resultPost.body.data.id,
      });
    const resultPostComments = await server
      .get(`/posts/${resultPost.body.data.id}/comments`)
      .set({ "Authorization": token1 });

    expect(resultPostComments.body.data.length).toBe(2);
    expect(resultPostComments.statusCode).toBe(expectedCode);
  });

  it("should return return quantity of post comments", async () => {
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
      .post("/posts/comments")
      .set({ "Authorization": token1 })
      .send({
        content: faker.lorem.paragraphs(),
        post_id: resultPost.body.data.id,
      });
    await server
      .post("/posts/comments")
      .set({ "Authorization": token1 })
      .send({
        content: faker.lorem.paragraphs(),
        post_id: resultPost.body.data.id,
      });
    const resultPostComments = await server
      .get(`/posts/${resultPost.body.data.id}/comments/count`)
      .set({ "Authorization": token1 });

    expect(resultPostComments.body.data.commentsQuantity).toBe(2);
  });

  it("should return return 401 when trying to update comment from others", async () => {
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
    const resultComment = await server
      .post("/posts/comments")
      .set({ "Authorization": token1 })
      .send({
        content: faker.lorem.paragraphs(),
        post_id: resultPost.body.data.id
      });
    const resultCommentUpdate = await server
      .put(`/posts/comments/${resultComment.body.data.id}`)
      .set({ "Authorization": token2 })
      .send({
        content: faker.lorem.paragraphs(),
      });

    expect(resultCommentUpdate.statusCode).toBe(expectedCode);
  });

  it("should return return 409 when post is comment to update is not found", async () => {
    const expectedCode = 409;
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
      .post("/posts/comments")
      .set({ "Authorization": token1 })
      .send({
        content: faker.lorem.paragraphs(),
        post_id: resultPost.body.data.id
      });
    const resultCommentUpdate = await server
      .put(`/posts/comments/${faker.random.numeric()}`)
      .set({ "Authorization": token1 })
      .send({
        content: faker.lorem.paragraphs(),
      });

    expect(resultCommentUpdate.statusCode).toBe(expectedCode);
  });

  it("should return return 201 when comment is updated", async () => {
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
    const resultCommentUpdate = await server
      .put(`/posts/comments/${resultComment.body.data.id}`)
      .set({ "Authorization": token1 })
      .send({
        content: faker.lorem.paragraphs(),
      });

    expect(resultCommentUpdate.statusCode).toBe(expectedCode);
  });

  it("should return return 401 when trying to delete comment from others", async () => {
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
    const resultComment = await server
      .post("/posts/comments")
      .set({ "Authorization": token1 })
      .send({
        content: faker.lorem.paragraphs(),
        post_id: resultPost.body.data.id
      });
    const resultCommentDelete = await server
      .delete(`/posts/comments/${resultComment.body.data.id}`)
      .set({ "Authorization": token2 })
      .send({
        content: faker.lorem.paragraphs(),
      });

    expect(resultCommentDelete.statusCode).toBe(expectedCode);
  });

  it("should return return 409 when comment to delete is not found", async () => {
    const expectedCode = 409;
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
      .post("/posts/comments")
      .set({ "Authorization": token1 })
      .send({
        content: faker.lorem.paragraphs(),
        post_id: resultPost.body.data.id
      });
    const resultCommentDelete = await server
      .delete(`/posts/comments/${faker.random.numeric()}`)
      .set({ "Authorization": token1 })
      .send({
        content: faker.lorem.paragraphs(),
      });

    expect(resultCommentDelete.statusCode).toBe(expectedCode);
  });

  it("should return return 201 when comment is deleted", async () => {
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
    const resultCommentDelete = await server
      .delete(`/posts/comments/${resultComment.body.data.id}`)
      .set({ "Authorization": token1 })
      .send({
        content: faker.lorem.paragraphs(),
      });
    const commentCount = await prisma.comment.count({
      where: {
        id: resultComment.body.data.id
      }
    });

    expect(resultCommentDelete.statusCode).toBe(expectedCode);
    expect(commentCount).toBe(0);
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
