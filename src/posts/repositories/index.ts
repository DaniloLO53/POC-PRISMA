import { Comment, Post, PostRating } from "@prisma/client";
import { prisma } from "@/config";
import {
  ICommentDTO,
  ICommentUpdateDTO,
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

async function findCommentById(commentId: number) {
  return await prisma.comment.findUnique({
    where: {
      id: Number(commentId)
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

async function comment({
  post_id, comment_id, author_id, content
}: ICommentDTO): Promise<Comment> {
  return await prisma.comment.create({
    data: {
      author_id,
      post_id: Number(post_id),
      comment_id: comment_id ? comment_id : null,
      content,
    }
  });
}

async function updateComment({
  content, commentId
}: Omit<ICommentUpdateDTO, "author_id">): Promise<Comment> {
  return await prisma.comment.update({
    data: {
      content,
    },
    where: {
      id: Number(commentId)
    }
  });
}

const postsRepository = {
  createPost,
  comment,
  updateComment,
  ratePost,
  findAll,
  findPostById,
  findCommentById,
  updatePost
};

export default postsRepository;
