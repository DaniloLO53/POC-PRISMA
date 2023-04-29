import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "@/middlewares/authentication.middleware";
import postsService from "@/posts/services";
import { Successful } from "@/utils/statusCodes/successful";

export async function comment(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
) {
  const { content, post_id, comment_id } = request.body;
  const { userId: author_id } = request;

  try {
    const comment = await postsService.comment({
      content,
      post_id,
      comment_id,
      author_id,
    });

    return response.status(Successful.CREATED).send(comment);
  } catch (error) {
    next(error);
  }
}

export async function updateComment(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
) {
  const { content } = request.body;
  const { commentId } = request.params;
  const { userId: author_id } = request;

  try {
    const comment = await postsService.updateComment({
      content,
      author_id,
      commentId
    });

    return response.status(Successful.CREATED).send(comment);
  } catch (error) {
    next(error);
  }
}

export async function deleteComment(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
) {
  const { commentId } = request.params;
  const { userId: author_id } = request;

  try {
    await postsService.deleteComment({
      author_id,
      commentId
    });

    return response.sendStatus(Successful.CREATED);
  } catch (error) {
    next(error);
  }
}

export async function getPostComments(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { postId } = request.params;

  try {
    const ratings = await postsService.getPostComments(postId);

    return response.status(Successful.OK).send(ratings);
  } catch (error) {
    next(error);
  }
}

export async function countPostComments(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { postId } = request.params;

  try {
    const commentsQuantity = await postsService.countPostComments(postId);

    return response.status(Successful.OK).send({ commentsQuantity });
  } catch (error) {
    next(error);
  }
}
