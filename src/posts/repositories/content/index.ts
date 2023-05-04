import { Post } from "@prisma/client";
import { prisma } from "@/config";
import { CreatePost, UpdatePost } from "@/posts/interfaces";

export async function findAll() {
  return await prisma.post.findMany();
}

export async function findPostById(post_id: number) {
  return await prisma.post.findUnique({
    where: {
      id: post_id
    }
  });
}

export async function createPost({
  content, author_id, movie_imdb
}: CreatePost): Promise<Post> {
  return await prisma.post.create({
    data: {
      author_id,
      content,
      movie_imdb,
    }
  });
}

export async function updatePost({
  content, movie_imdb, post_id
}: Omit<UpdatePost, "author_id">): Promise<Post> {
  return await prisma.post.update({
    data: {
      content,
      movie_imdb,
    },
    where: {
      id: post_id
    }
  });
}

