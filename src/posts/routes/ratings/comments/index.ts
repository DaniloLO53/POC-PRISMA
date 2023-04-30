import express from "express";
import { validateBody, validateParams } from "@/middlewares/schemaValidation.middleware";
import { commentIdSchema, commentRatingSchema } from "@/posts/schemas";
import { authenticateToken } from "@/middlewares/authentication.middleware";
import { PostsCreateServices, PostsGetServices } from "@/posts/services";
import { create, get } from "@/posts/controllers";

const {
  getPostCommentRatings,
  countPostCommentRatings
} = PostsGetServices;

const {
  rateComment
} = PostsCreateServices;

const commentRatingRoute = express.Router();

commentRatingRoute.post("/comments/rating",
  validateBody(commentRatingSchema),
  authenticateToken,
  create(rateComment)
);
commentRatingRoute.get("/comments/:commentId/ratings",
  validateParams(commentIdSchema),
  authenticateToken,
  get(getPostCommentRatings, "commentId")
);
commentRatingRoute.get("/comments/:commentId/ratings/count",
  validateParams(commentIdSchema),
  authenticateToken,
  get(countPostCommentRatings, "commentId")
);

export default commentRatingRoute;
