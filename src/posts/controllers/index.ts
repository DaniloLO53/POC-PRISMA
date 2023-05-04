import { NextFunction as Next, Response as Res } from "express";
import {
  Auth,
  CommentId,
  CreatePost,
  DeleteComment,
  PostId,
  UpdateComment,
  UpdatePost
} from "../interfaces";
import { AuthenticatedRequest as AuthReq } from "@/middlewares/authentication.middleware";
import postsService, {
  PostsCreateServices,
  PostsGetServices,
  PostsRemoveServices,
  PostsUpdatePostServices,
  PostsUpdateServices,
} from "@/posts/services";
import { Successful as S } from "@/utils/statusCodes/successful";
import { validateBody } from "@/middlewares/schemaValidation.middleware";

interface PostIdStringed {
  [key: string]: string; // index signature
  post_id: string;
}

interface CommentIdStringed {
  [key: string]: string; // index signature
  comment_id: string;
}

type Params = CommentIdStringed | PostIdStringed;

interface NumberedParams {
  comment_id?: number;
  post_id?: number;
}

const transformParamValueToNumber = (params: Params): NumberedParams => {
  const numberedParams = {};
  for (const key in params) {
    Object.assign(numberedParams, {
      [key]: Number(params[key])
    });
  }

  return numberedParams;
};

export function update(service: PostsUpdateServices) {
  return function (request: AuthReq, response: Res, next: Next) {
    const { userId: author_id } = request;
    const numberedParams = transformParamValueToNumber(request.params as Params);

    postsService[service]({
      author_id, ...numberedParams, ...request.body
    } as Partial<CreatePost> & PostId & UpdateComment)
      .then((data) => response.status(S.CREATED).send({ data }))
      .catch((error) => next(error));
  };
}

export function remove(service: PostsRemoveServices) {
  return function (request: AuthReq, response: Res, next: Next) {
    const { userId: author_id } = request;
    const numberedParams = transformParamValueToNumber(request.params as Params);

    postsService[service]({ author_id, ...numberedParams } as DeleteComment)
      .then(() => response.sendStatus(S.CREATED))
      .catch((error) => next(error));
  };
}

export function get(service: PostsGetServices) {
  return function (request: AuthReq, response: Res, next: Next) {
    const { userId: author_id } = request;
    const numberedParams = transformParamValueToNumber(request.params as Params);

    postsService[service]({ author_id, ...numberedParams } as CommentId & PostId & Auth)
      .then((data) => response.status(S.OK).send({ data }))
      .catch((error) => next(error));
  };
}

export function create(service: PostsCreateServices) {
  return function (request: AuthReq, response: Res, next: Next) {
    const { userId: author_id } = request;
  
    postsService[service]({ author_id, ...request.body })
      .then((data) => response.status(S.CREATED).send({ data }))
      .catch((error) => next(error));
  };
}
