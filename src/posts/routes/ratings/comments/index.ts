import express from "express";
import { validateBody, validateParams } from "@/middlewares/schemaValidation.middleware";
import { commentIdSchema, commentRatingSchema } from "@/posts/schemas";
import { authenticateToken } from "@/middlewares/authentication.middleware";
import {
  countPostCommentRatings,
  getPostCommentRatings,
  rateComment
} from "@/posts/controllers/ratings/comments";

const commentRatingRoute = express.Router();

commentRatingRoute.post("/comments/rating",
  validateBody(commentRatingSchema),
  authenticateToken,
  rateComment
);
commentRatingRoute.get("/comments/:commentId/ratings",
  validateParams(commentIdSchema),
  authenticateToken,
  getPostCommentRatings
);
commentRatingRoute.get("/comments/:commentId/ratings/count",
  validateParams(commentIdSchema),
  authenticateToken,
  countPostCommentRatings
);

export default commentRatingRoute;
