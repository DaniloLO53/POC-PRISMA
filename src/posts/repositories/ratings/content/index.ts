import { PostRating } from "@prisma/client";
import { prisma } from "@/config";
import { IPostRateDTO } from "@/posts/interfaces";

export async function ratePost({
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

export async function findPostRatings(postId: string) {
  return await prisma.postRating.findMany({
    where: {
      post_id: Number(postId)
    }
  });
}

export async function countPostRatings(postId: string) {
  return await prisma.postRating.count({
    where: {
      post_id: Number(postId)
    }
  });
}
