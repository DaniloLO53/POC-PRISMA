import { PostRating } from "@prisma/client";
import { postNotFoundError } from "@/errors/notFoundPost.errors";
import { IPostRateDTO } from "@/posts/interfaces";
import postsRepository from "@/posts/repositories";

export async function getPostRatings(postId: string) {
  const post = await postsRepository.findPostById(postId);
  if (!post) throw postNotFoundError();

  const ratings = await postsRepository.findPostRatings(postId);


  return ratings;
}

export async function countPostRatings(postId: string) {
  const post = await postsRepository.findPostById(postId);
  if (!post) throw postNotFoundError();

  const ratingsQuantity = await postsRepository.countPostRatings(postId);

  return { ratingsQuantity };
}

export async function ratePost({
  post_id, author_id, type
}: IPostRateDTO): Promise<PostRating> {
  const post = await postsRepository.findPostById(post_id);

  if (!post) throw postNotFoundError();

  return await postsRepository.ratePost({
    author_id,
    type,
    post_id
  });
}
