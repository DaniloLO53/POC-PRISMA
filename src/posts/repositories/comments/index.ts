import { Comment } from "@prisma/client";
import { prisma } from "@/config";
import { CreateComment, DeleteComment, UpdateComment } from "@/posts/interfaces";

export async function comment({
  post_id, comment_id, author_id, content
}: CreateComment): Promise<Comment> {
  return await prisma.comment.create({
    data: {
      author_id,
      post_id,
      comment_id: comment_id ? comment_id : null,
      content,
    }
  });
}

export async function updateComment({
  content, comment_id
}: Omit<UpdateComment, "author_id">): Promise<Comment> {
  return await prisma.comment.update({
    data: {
      content,
    },
    where: {
      id: comment_id
    }
  });
}

export async function deleteComment({
  comment_id
}: Omit<DeleteComment, "author_id">): Promise<void> {
  await prisma.comment.delete({
    where: {
      id: comment_id
    }
  });
}

export async function findCommentById(comment_id: number) {
  return await prisma.comment.findUnique({
    where: {
      id: comment_id
    }
  });
}

export async function findPostComments(post_id: number) {
  return await prisma.comment.findMany({
    where: {
      post_id
    }
  });
}

export async function countPostComments(post_id: number) {
  return await prisma.comment.count({
    where: {
      post_id
    }
  });
}
