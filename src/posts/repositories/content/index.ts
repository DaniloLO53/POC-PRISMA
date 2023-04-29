import { Post } from "@prisma/client";
import { prisma } from "@/config";
import { IPostDTO, IPostUpdateDTO } from "@/posts/interfaces";

export async function findAll() {
  return await prisma.post.findMany();
}

export async function findPostById(postId: string) {
  return await prisma.post.findUnique({
    where: {
      id: Number(postId)
    }
  });
}

export async function createPost({
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

export async function updatePost({
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

