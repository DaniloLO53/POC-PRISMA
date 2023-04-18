import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  let user = await prisma.user.findFirst();
  if (!user) {
    console.log('No users found - creating new user...');
    user = await prisma.user.create({
      data: {
        name: "user001",
        id: 1,
        password: "123",
        email: "user@gmail.com"
      }
    })
  }

  console.log({ user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });