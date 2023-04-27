import express from "express";
import { validateBody, validateParams } from "@/middlewares/schemaValidation.middleware";
import { authenticateToken } from "@/middlewares/authentication.middleware";
import {
  postIdSchema,
  postSchema,
  postRatingSchema,
  commentSchema
} from "@/posts/schemas";
import {
  createPost,
  updatePost,
  getAllPosts,
  getPost,
  ratePost,
  comment
} from "@/posts/controllers";

const postsRoute = express.Router();

postsRoute.post("/",
  validateBody(postSchema),
  authenticateToken,
  createPost
);
postsRoute.put("/:postId",
  validateBody(postSchema),
  validateParams(postIdSchema),
  authenticateToken,
  updatePost
);
postsRoute.post("/rating",
  validateBody(postRatingSchema),
  authenticateToken,
  ratePost
);
postsRoute.post("/comments",
  validateBody(commentSchema),
  authenticateToken,
  comment
);
// postsRoute.post("/comments",
//   validateBody(commentSchema),
//   authenticateToken,
//   updatePost
// );

postsRoute.get("/", getAllPosts);
postsRoute.get("/:postId", getPost);

export { postsRoute };
