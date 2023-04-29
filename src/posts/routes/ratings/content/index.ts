import express from "express";
import { postIdSchema, postRatingSchema } from "@/posts/schemas";
import { authenticateToken } from "@/middlewares/authentication.middleware";
import { validateBody, validateParams } from "@/middlewares/schemaValidation.middleware";
import {
  countPostRatings,
  getPostRatings,
  ratePost
} from "@/posts/controllers/ratings/content";

const postRatingRoute = express.Router();

postRatingRoute.post("/rating",
  validateBody(postRatingSchema),
  authenticateToken,
  ratePost
);
postRatingRoute.get("/:postId/ratings",
  validateParams(postIdSchema),
  authenticateToken,
  getPostRatings
);
postRatingRoute.get("/:postId/ratings/count",
  validateParams(postIdSchema),
  authenticateToken,
  countPostRatings
);

export default postRatingRoute;
