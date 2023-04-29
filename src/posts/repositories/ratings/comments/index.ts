import { CommentRating } from "@prisma/client";
import { prisma } from "@/config";
import { ICommentRateDTO } from "@/posts/interfaces";


export async function rateComment({
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

export async function findPostCommentRatings(commentId: string) {
  return await prisma.commentRating.findMany({
    where: {
      comment_id: Number(commentId)
    }
  });
}

export async function countPostCommentRatings(commentId: string) {
  return await prisma.commentRating.count({
    where: {
      comment_id: Number(commentId)
    }
  });
}
