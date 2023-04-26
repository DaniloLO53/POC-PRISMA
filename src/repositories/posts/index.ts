import { Post } from "@prisma/client";
import { prisma } from "@/config";
import { IPostDTO, IPostUpdateDTO } from "@/services";

async function findAll() {
  const posts = await prisma.post.findMany();

  return posts;
}

async function findPostById(postId: string) {
  const posts = await prisma.post.findUnique({
    where: {
      id: Number(postId)
    }
  });

  return posts;
}

async function createPost({
  content, author_id, movie_imdb
}: IPostDTO): Promise<Post> {
  return await prisma.post.create({
    data: {
      author_id,
      content,
      movie_imdb,
    }
  });
}

async function updatePost({
  content, movie_imdb, postId
}: Omit<IPostUpdateDTO, "author_id">): Promise<Post> {
  return await prisma.post.update({
    data: {
      content,
      movie_imdb,
    },
    where: {
      id: Number(postId)
    }
  });
}

const postsRepository = {
  createPost,
  findAll,
  findPostById,
  updatePost
};

export default postsRepository;
