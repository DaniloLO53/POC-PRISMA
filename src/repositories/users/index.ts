import { prisma } from "@/config";

async function findAll() {
  const users = await prisma.user.findMany();

  return users;
}

const usersRepository = {
  findAll
};

export default usersRepository;
