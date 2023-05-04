import { PostRating } from "@prisma/client";
import { postNotFoundError } from "@/errors/notFoundPost.errors";
import postsRepository from "@/posts/repositories";
import { PostId, RatePost } from "@/posts/interfaces";

export async function getPostRatings({ post_id }: PostId) {
  const post = await postsRepository.findPostById(post_id);
  if (!post) throw postNotFoundError();

  const ratings = await postsRepository.findPostRatings(post_id);


  return ratings;
}

export async function countPostRatings({ post_id }: PostId) {
  const post = await postsRepository.findPostById(post_id);
  if (!post) throw postNotFoundError();

  const ratingsQuantity = await postsRepository.countPostRatings(post_id);

  return { ratingsQuantity };
}

export async function ratePost({
  post_id, author_id, type
}: RatePost): Promise<PostRating> {
  const post = await postsRepository.findPostById(post_id);

  if (!post) throw postNotFoundError();

  return await postsRepository.ratePost({
    author_id,
    type,
    post_id
  });
}
