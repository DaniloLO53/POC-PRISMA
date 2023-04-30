import { NextFunction as Next, Response as Res } from "express";
import { AuthenticatedRequest as AuthReq } from "@/middlewares/authentication.middleware";
import postsService, {
  PostsCreateServices,
  PostsGetServices,
  PostsRemoveServices,
  PostsUpdateServices
} from "@/posts/services";
import { Successful as S } from "@/utils/statusCodes/successful";

type CustomId = "commentId" | "postId";

export function update(service: PostsUpdateServices, customId: CustomId) {
  return function (request: AuthReq, response: Res, next: Next) {
    const { userId: author_id } = request;
    const id = request.params[customId];
  
    postsService[service]({ ...request.body, author_id, [customId]: id })
      .then((data) => response.status(S.CREATED).send({ data }))
      .catch((error) => next(error));
  };
}

export function remove(service: PostsRemoveServices, customId: CustomId) {
  return function (request: AuthReq, response: Res, next: Next) {
    const id = request.params[customId];
    const { userId: author_id } = request;
  
    postsService[service]({ id: Number(id), author_id })
      .then(() => response.sendStatus(S.CREATED))
      .catch((error) => next(error));
  };
}

export function get(service: PostsGetServices, customId: CustomId) {
  return function (request: AuthReq, response: Res, next: Next) {
    const id = request.params[customId];
  
    postsService[service](id)
      .then((data) => response.status(S.OK).send({ data }))
      .catch((error) => next(error));
  };
}

export function create(service: PostsCreateServices) {
  return function (request: AuthReq, response: Res, next: Next) {
    const { userId: author_id } = request;
  
    postsService[service]({ ...request.body, author_id })
      .then((data) => response.status(S.CREATED).send({ data }))
      .catch((error) => next(error));
  };
}
