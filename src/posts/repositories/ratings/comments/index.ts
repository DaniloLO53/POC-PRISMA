import { CommentRating } from "@prisma/client";
import { prisma } from "@/config";
import { RateComment } from "@/posts/interfaces";


export async function rateComment({
  comment_id, author_id, type
}: RateComment): Promise<CommentRating> {
  return await prisma.commentRating.create({
    data: {
      author_id,
      comment_id,
      type,
    }
  });
}

export async function findPostCommentRatings(comment_id: number) {
  return await prisma.commentRating.findMany({
    where: {
      comment_id
    }
  });
}

export async function countPostCommentRatings(comment_id: number) {
  return await prisma.commentRating.count({
    where: {
      comment_id
    }
  });
}
