import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  let user = await prisma.user.findFirst();
  if (!user) {
    console.log('No users found - creating new user...');
    user = await prisma.user.create({
      data: {
        first_name: "Danilo",
        last_name: "Leão de Oliveira",
        birth: "29-05-1996",
        description: "Hi, I'm Danilo",
        password: "123",
        email: "user@gmail.com"
      }
    })
  } else {
    console.log('User found')
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
  //