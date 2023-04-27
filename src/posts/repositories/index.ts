import { Comment, Post, PostRating } from "@prisma/client";
import { prisma } from "@/config";
import {
  IPostCommentDTO,
  IPostDTO,
  IPostRateDTO,
  IPostUpdateDTO
} from "@/posts/services/interfaces";

async function findAll() {
  return await prisma.post.findMany();
}

async function findPostById(postId: string) {
  return await prisma.post.findUnique({
    where: {
      id: Number(postId)
    }
  });
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

async function commentPost({
  post_id, author_id, content
}: IPostCommentDTO): Promise<Comment> {
  return await prisma.comment.create({
    data: {
      author_id,
      post_id: Number(post_id),
      content,
    }
  });
}

const postsRepository = {
  createPost,
  commentPost,
  ratePost,
  findAll,
  findPostById,
  updatePost
};

export default postsRepository;
