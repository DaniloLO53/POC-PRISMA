import supertest from "supertest";
import { cleanDb } from "../helpers";
import app, { init } from "@/app";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("GET /users", () => {
  it("should return 200 to status code", async () => {
    const expectedCode = 200;
    const result = await server.get("/users");

    expect(result.status).toBe(expectedCode);
  });
});
//
