import { faker } from "@faker-js/faker";
import { cleanDb, hashPassword, validatePassword } from "../helpers";
import { close, init } from "@/app";

beforeAll(async () => await init());
afterEach(async () => {
  cleanDb();
  close();
});

describe("Hashing password function", () => {
  it("should hash password correctly", async () => {
    const password = faker.internet.password();
    const hashedPassword = await hashPassword(password);

    const validationTrue = await validatePassword(password, hashedPassword);
    const validationFalse = await validatePassword("password", hashedPassword);

    expect(validationTrue).toBe(true);
    expect(validationFalse).toBe(false);
  });
});
