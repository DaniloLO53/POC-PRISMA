import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "@/middlewares/authentication.middleware";
import postsService from "@/posts/services";
import { Successful } from "@/utils/statusCodes/successful";

export async function rateComment(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
) {
  const { type, comment_id } = request.body;
  const { userId: author_id } = request;

  try {
    await postsService.rateComment({
      type,
      comment_id,
      author_id,
    });

    return response.sendStatus(Successful.CREATED);
  } catch (error) {
    next(error);
  }
}

export async function getPostCommentRatings(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { commentId } = request.params;

  
  try {
    const ratings = await postsService.getPostCommentRatings(commentId);

    return response.status(Successful.OK).send(ratings);
  } catch (error) {
    next(error);
  }
}

export async function countPostCommentRatings(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { commentId } = request.params;

  try {
    const ratingsQuantity = await postsService.countPostCommentRatings(commentId);

    return response.status(Successful.OK).send({ ratingsQuantity });
  } catch (error) {
    next(error);
  }
}
