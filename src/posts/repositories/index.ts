import { Comment, CommentRating, Post, PostRating } from "@prisma/client";
import { prisma } from "@/config";
import {
  ICommentDTO,
  ICommentRateDTO,
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

async function findPostRatings(postId: string) {
  return await prisma.postRating.findMany({
    where: {
      post_id: Number(postId)
    }
  });
}

async function countPostRatings(postId: string) {
  return await prisma.postRating.count({
    where: {
      post_id: Number(postId)
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

async function deleteComment({
  commentId
}: Omit<ICommentUpdateDTO, "content" | "author_id">): Promise<void> {
  await prisma.comment.delete({
    where: {
      id: Number(commentId)
    }
  });
}

async function rateComment({
  comment_id, author_id, type
}: ICommentRateDTO): Promise<CommentRating> {
  return await prisma.commentRating.create({
    data: {
      author_id,
      comment_id: Number(comment_id),
      type,
    }
  });
}

async function findPostCommentRatings(commentId: string) {
  return await prisma.commentRating.findMany({
    where: {
      comment_id: Number(commentId)
    }
  });
}

async function countPostCommentRatings(commentId: string) {
  return await prisma.commentRating.count({
    where: {
      comment_id: Number(commentId)
    }
  });
}

async function findPostComments(postId: string) {
  return await prisma.comment.findMany({
    where: {
      post_id: Number(postId)
    }
  });
}

async function countPostComments(postId: string) {
  return await prisma.comment.count({
    where: {
      post_id: Number(postId)
    }
  });
}

const postsRepository = {
  createPost,
  comment,
  updateComment,
  deleteComment,
  rateComment,
  findPostCommentRatings,
  countPostCommentRatings,
  findPostComments,
  countPostComments,
  ratePost,
  findPostRatings,
  countPostRatings,
  findAll,
  findPostById,
  findCommentById,
  updatePost
};

export default postsRepository;
