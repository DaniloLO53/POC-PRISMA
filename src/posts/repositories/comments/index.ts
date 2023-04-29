import { Comment } from "@prisma/client";
import { prisma } from "@/config";
import { ICommentDTO, ICommentUpdateDTO } from "@/posts/interfaces";

export async function comment({
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

export async function updateComment({
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

export async function deleteComment({
  commentId
}: Omit<ICommentUpdateDTO, "content" | "author_id">): Promise<void> {
  await prisma.comment.delete({
    where: {
      id: Number(commentId)
    }
  });
}

export async function findCommentById(commentId: number) {
  return await prisma.comment.findUnique({
    where: {
      id: Number(commentId)
    }
  });
}

export async function findPostComments(postId: string) {
  return await prisma.comment.findMany({
    where: {
      post_id: Number(postId)
    }
  });
}

export async function countPostComments(postId: string) {
  return await prisma.comment.count({
    where: {
      post_id: Number(postId)
    }
  });
}
