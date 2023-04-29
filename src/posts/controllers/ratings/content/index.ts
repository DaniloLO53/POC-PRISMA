import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "@/middlewares/authentication.middleware";
import postsService from "@/posts/services";
import { Successful } from "@/utils/statusCodes/successful";

export async function ratePost(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
) {
  const { type, post_id } = request.body;
  const { userId: author_id } = request;

  try {
    await postsService.ratePost({
      type,
      post_id,
      author_id,
    });

    return response.sendStatus(Successful.CREATED);
  } catch (error) {
    next(error);
  }
}

export async function getPostRatings(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { postId } = request.params;

  try {
    const ratings = await postsService.getPostRatings(postId);

    return response.status(Successful.OK).send(ratings);
  } catch (error) {
    next(error);
  }
}

export async function countPostRatings(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { postId } = request.params;

  try {
    const ratingsQuantity = await postsService.countPostRatings(postId);

    return response.status(Successful.OK).send({ ratingsQuantity });
  } catch (error) {
    next(error);
  }
}
