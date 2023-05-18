import { faker } from "@faker-js/faker";
import { prisma } from "@/config";

interface SignupData {
  email?: string;
  password?: string
}

export async function signup({ email, password }: SignupData = {}) {
  const defaultData = {
    email: faker.internet.email(),
    password: faker.internet.password(4) + "*Aa1",
  };
  
  return prisma.user.create({
    data: {
      email: email || defaultData.email,
      password: password || defaultData.password,
    }
  });
}
