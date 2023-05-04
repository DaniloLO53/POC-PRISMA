import { PostRating } from "@prisma/client";
import { prisma } from "@/config";
import { RatePost } from "@/posts/interfaces";

export async function ratePost({
  post_id, author_id, type
}: RatePost): Promise<PostRating> {
  return await prisma.postRating.create({
    data: {
      author_id,
      post_id,
      type,
    }
  });
}

export async function findPostRatings(post_id: number) {
  return await prisma.postRating.findMany({
    where: {
      post_id
    }
  });
}

export async function countPostRatings(post_id: number) {
  return await prisma.postRating.count({
    where: {
      post_id
    }
  });
}
