import { CommentRating } from "@prisma/client";
import { commentNotFoundError } from "@/errors/notFoundComment.errors";
import { postNotFoundError } from "@/errors/notFoundPost.errors";
import postsRepository from "@/posts/repositories";
import { CommentId, RateComment } from "@/posts/interfaces";

export async function rateComment({
  comment_id, author_id, type
}: RateComment): Promise<CommentRating> {
  const comment = await postsRepository.findCommentById(Number(comment_id));

  if (!comment) throw postNotFoundError();

  return await postsRepository.rateComment({
    author_id,
    type,
    comment_id
  });
}

export async function getPostCommentRatings({ comment_id }: CommentId) {
  const comment = await postsRepository.findCommentById(Number(comment_id));
  if (!comment) throw commentNotFoundError();

  const ratings = await postsRepository.findPostCommentRatings(comment_id);


  return ratings;
}

export async function countPostCommentRatings({ comment_id }: CommentId) {
  const comment = await postsRepository.findCommentById(Number(comment_id));
  if (!comment) throw commentNotFoundError();

  const ratingsQuantity = await postsRepository.countPostCommentRatings(comment_id);

  return { ratingsQuantity };
}
