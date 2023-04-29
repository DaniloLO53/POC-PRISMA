import { NextFunction, Request, Response } from "express";
import { Successful } from "@/utils/statusCodes/successful";
import { AuthenticatedRequest } from "@/middlewares/authentication.middleware";
import postsService from "@/posts/services";

export async function getAllPosts(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const posts = await postsService.getAllPosts();

    return response.status(Successful.OK).send(posts);
  } catch (error) {
    next(error);
  }
}

export async function getPost(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { postId } = request.params;

  try {
    const post = await postsService.getPost(postId);

    return response.status(Successful.OK).send(post);
  } catch (error) {
    next(error);
  }
}

export async function createPost(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
) {
  const { movie_imdb, content } = request.body;
  const { userId: author_id } = request;

  try {
    const post = await postsService.createPost({
      movie_imdb,
      content,
      author_id
    });

    return response.status(Successful.CREATED).send(post);
  } catch (error) {
    next(error);
  }
}

export async function updatePost(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
) {
  const { movie_imdb, content } = request.body;
  const { postId } = request.params;
  const { userId: author_id } = request;

  try {
    const post = await postsService.updatePost({
      movie_imdb,
      content,
      author_id,
      postId
    });

    return response.status(Successful.CREATED).send(post);
  } catch (error) {
    next(error);
  }
}

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
    const post = await postsService.getPostRatings(postId);

    return response.status(Successful.OK).send(post);
  } catch (error) {
    next(error);
  }
}

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
