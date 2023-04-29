import express from "express";
import { authenticateToken } from "@/middlewares/authentication.middleware";
import { validateBody, validateParams } from "@/middlewares/schemaValidation.middleware";
import {
  commentIdSchema,
  commentSchema,
  commentUpdateSchema,
  postIdSchema
} from "@/posts/schemas";
import {
  comment,
  countPostComments,
  deleteComment,
  getPostComments,
  updateComment
} from "@/posts/controllers/comments";

const postsCommentsRoute = express.Router();

postsCommentsRoute.get("/:postId/comments",
  validateParams(postIdSchema),
  authenticateToken,
  getPostComments
);
postsCommentsRoute.get("/:postId/comments/count",
  validateParams(postIdSchema),
  authenticateToken,
  countPostComments
);
postsCommentsRoute.post("/comments",
  validateBody(commentSchema),
  authenticateToken,
  comment
);
postsCommentsRoute.put("/comments/:commentId",
  validateBody(commentUpdateSchema),
  validateParams(commentIdSchema),
  authenticateToken,
  updateComment
);
postsCommentsRoute.delete("/comments/:commentId",
  validateParams(commentIdSchema),
  authenticateToken,
  deleteComment
);

export default postsCommentsRoute;
