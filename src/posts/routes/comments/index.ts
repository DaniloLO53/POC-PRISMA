import express from "express";
import { authenticateToken } from "@/middlewares/authentication.middleware";
import { validateBody, validateParams } from "@/middlewares/schemaValidation.middleware";
import {
  commentIdSchema,
  commentSchema,
  commentUpdateSchema,
  postIdSchema
} from "@/posts/schemas";
import { create, get, remove, update } from "@/posts/controllers";
import {
  PostsCreateServices,
  PostsGetServices,
  PostsRemoveServices,
  PostsUpdateServices
} from "@/posts/services";

const { countPostComments, getPostComments } = PostsGetServices;
const { deleteComment } = PostsRemoveServices;
const { updateComment } = PostsUpdateServices;
const { comment } = PostsCreateServices;

const postsCommentsRoute = express.Router();

postsCommentsRoute.get("/:post_id/comments",
  validateParams(postIdSchema),
  authenticateToken,
  get(getPostComments)
);
postsCommentsRoute.get("/:post_id/comments/count",
  validateParams(postIdSchema),
  authenticateToken,
  get(countPostComments)
);
postsCommentsRoute.post("/comments",
  validateBody(commentSchema),
  authenticateToken,
  create(comment)
);
postsCommentsRoute.put("/comments/:comment_id",
  validateBody(commentUpdateSchema),
  validateParams(commentIdSchema),
  authenticateToken,
  update(updateComment)
);
postsCommentsRoute.delete("/comments/:comment_id",
  validateParams(commentIdSchema),
  authenticateToken,
  remove(deleteComment)
);

export default postsCommentsRoute;
