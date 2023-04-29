import { prisma } from "@/config";
import { IUserData } from "@/users/schemas";
import { IRelashionshipDTO } from "@/users/services/interfaces";

async function findAll() {
  const users = await prisma.user.findMany();

  return users;
}

async function findFolloweds(idFromFollower: number) {
  const users = await prisma.relationship.findMany({
    where: {
      following: idFromFollower
    },
  }).then((relashionships) => relashionships.map(({ followed }) => followed));

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

async function create(data: IUserData) {
  const users = await prisma.user.create({ data });

  return users;
}

async function createOrDestroyRelashionship({
  idFromFollowed, idFromFollower, follow
}: IRelashionshipDTO) {
  if (follow) {
    await prisma.relationship.create({
      data: {
        followed: idFromFollowed,
        following: idFromFollower,
      }
    });
  } else {
    await prisma.relationship.delete({
      where: {
        followed_following: {
          followed: idFromFollowed,
          following: idFromFollower
        }
      }
    });
  }
}

async function findPostsByUserId(userId: string) {
  return await prisma.post.findMany({
    where: {
      author_id: Number(userId)
    }
  });
}

const usersRepository = {
  findAll,
  findFolloweds,
  findUnique,
  create,
  createOrDestroyRelashionship,
  findPostsByUserId
};

export default usersRepository;
