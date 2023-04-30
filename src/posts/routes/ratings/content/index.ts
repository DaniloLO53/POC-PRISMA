import express from "express";
import { postIdSchema, postRatingSchema } from "@/posts/schemas";
import { authenticateToken } from "@/middlewares/authentication.middleware";
import { validateBody, validateParams } from "@/middlewares/schemaValidation.middleware";
import { PostsCreateServices, PostsGetServices } from "@/posts/services";
import { create, get } from "@/posts/controllers";

const { getPostRatings, countPostRatings } = PostsGetServices;
const { ratePost } = PostsCreateServices;

const postRatingRoute = express.Router();

postRatingRoute.post("/rating",
  validateBody(postRatingSchema),
  authenticateToken,
  create(ratePost)
);
postRatingRoute.get("/:postId/ratings",
  validateParams(postIdSchema),
  authenticateToken,
  get(getPostRatings, "postId")
);
postRatingRoute.get("/:postId/ratings/count",
  validateParams(postIdSchema),
  authenticateToken,
  get(countPostRatings, "postId")
);

export default postRatingRoute;
