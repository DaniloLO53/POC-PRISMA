import express from "express";
import { validateBody, validateParams } from "@/middlewares/schemaValidation.middleware";
import { authenticateToken } from "@/middlewares/authentication.middleware";
import {
  postIdSchema,
  postSchema,
  postRatingSchema,
  commentSchema,
  commentIdSchema,
  commentUpdateSchema,
  commentRatingSchema
} from "@/posts/schemas";
import {
  createPost,
  updatePost,
  getAllPosts,
  getPost,
  ratePost,
  comment,
  updateComment,
  deleteComment,
  rateComment,
  getPostRatings,
  countPostRatings,
  getPostComments,
  countPostComments,
} from "@/posts/controllers";

const postsRoute = express.Router();

postsRoute.post("/", validateBody(postSchema), authenticateToken, createPost);
postsRoute.get("/:postId", validateParams(postIdSchema), authenticateToken, getPost);
postsRoute.put("/:postId",
  validateBody(postSchema),
  validateParams(postIdSchema),
  authenticateToken,
  updatePost
);

postsRoute.post("/rating", validateBody(postRatingSchema), authenticateToken, ratePost);
postsRoute.get("/:postId/ratings",
  validateParams(postIdSchema),
  authenticateToken,
  getPostRatings
);
postsRoute.get("/:postId/ratings/count",
  validateParams(postIdSchema),
  authenticateToken,
  countPostRatings
);
postsRoute.get("/:postId/comments",
  validateParams(postIdSchema),
  authenticateToken,
  getPostComments
);
postsRoute.get("/:postId/comments/count",
  validateParams(postIdSchema),
  authenticateToken,
  countPostComments
);

postsRoute.post("/comments", validateBody(commentSchema), authenticateToken, comment);
postsRoute.put("/comments/:commentId",
  validateBody(commentUpdateSchema),
  validateParams(commentIdSchema),
  authenticateToken,
  updateComment
);
postsRoute.delete("/comments/:commentId",
  validateParams(commentIdSchema),
  authenticateToken,
  deleteComment
);

postsRoute.post("/comments/rating",
  validateBody(commentRatingSchema),
  authenticateToken,
  rateComment
);

postsRoute.get("/", getAllPosts);

export { postsRoute };
