import { Post, PostRating } from "@prisma/client";
import { prisma } from "@/config";
import { IPostDTO, IPostRateDTO, IPostUpdateDTO } from "@/services";

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

async function ratePost({
  post_id, author_id, type
}: IPostRateDTO): Promise<PostRating> {
  return await prisma.postRating.create({
    data: {
      author_id,
      post_id: Number(post_id),
      type,
    }
  });
}

const postsRepository = {
  createPost,
  ratePost,
  findAll,
  findPostById,
  updatePost
};

export default postsRepository;
