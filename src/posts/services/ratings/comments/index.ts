import { CommentRating } from "@prisma/client";
import { commentNotFoundError } from "@/errors/notFoundComment.errors";
import { postNotFoundError } from "@/errors/notFoundPost.errors";
import postsRepository from "@/posts/repositories";
import { ICommentRateDTO } from "@/posts/interfaces";

export async function rateComment({
  comment_id, author_id, type
}: ICommentRateDTO): Promise<CommentRating> {
  const comment = await postsRepository.findCommentById(Number(comment_id));

  if (!comment) throw postNotFoundError();

  return await postsRepository.rateComment({
    author_id,
    type,
    comment_id
  });
}

export async function getPostCommentRatings(commentId: string) {
  const comment = await postsRepository.findCommentById(Number(commentId));
  if (!comment) throw commentNotFoundError();

  const ratings = await postsRepository.findPostCommentRatings(commentId);


  return ratings;
}

export async function countPostCommentRatings(commentId: string) {
  const comment = await postsRepository.findCommentById(Number(commentId));
  if (!comment) throw commentNotFoundError();

  const ratingsQuantity = await postsRepository.countPostCommentRatings(commentId);

  return ratingsQuantity;
}
