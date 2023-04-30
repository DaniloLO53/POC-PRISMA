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

const {
  countPostComments,
  getPostComments
} = PostsGetServices;

const {
  deleteComment
} = PostsRemoveServices;

const {
  updateComment,
} = PostsUpdateServices;

const {
  comment
} = PostsCreateServices;

const postsCommentsRoute = express.Router();

postsCommentsRoute.get("/:postId/comments",
  validateParams(postIdSchema),
  authenticateToken,
  get(getPostComments, "postId")
);
postsCommentsRoute.get("/:postId/comments/count",
  validateParams(postIdSchema),
  authenticateToken,
  get(countPostComments, "postId")
);
postsCommentsRoute.post("/comments",
  validateBody(commentSchema),
  authenticateToken,
  create(comment)
);
postsCommentsRoute.put("/comments/:commentId",
  validateBody(commentUpdateSchema),
  validateParams(commentIdSchema),
  authenticateToken,
  update(updateComment, "commentId")
);
postsCommentsRoute.delete("/comments/:commentId",
  validateParams(commentIdSchema),
  authenticateToken,
  remove(deleteComment, "commentId")
);

export default postsCommentsRoute;
