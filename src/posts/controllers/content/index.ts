import { NextFunction, Request, Response } from "express";
import postsService from "@/posts/services";
import { Successful } from "@/utils/statusCodes/successful";
import { AuthenticatedRequest } from "@/middlewares/authentication.middleware";

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
