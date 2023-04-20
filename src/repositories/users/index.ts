import { prisma } from "@/config";
import { UserData } from "@/schemas";

async function findAll() {
  const users = await prisma.user.findMany();

  return users;
}

async function findUnique(email: string) {
  const users = await prisma.user.findFirst({
    where: {
      email,
    }
  });

  return users;
}

async function create(data: UserData) {
  const users = await prisma.user.create({ data });

  return users;
}

const usersRepository = {
  findAll,
  findUnique,
  create
};

export default usersRepository;
