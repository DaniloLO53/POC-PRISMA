import express from "express";
import { postIdSchema, postSchema } from "@/posts/schemas";
import { authenticateToken } from "@/middlewares/authentication.middleware";
import { validateBody, validateParams } from "@/middlewares/schemaValidation.middleware";
import {
  createPost,
  getAllPosts,
  getPost,
  updatePost
} from "@/posts/controllers/content";

const postsContentRoute = express.Router();

postsContentRoute.post("/", validateBody(postSchema), authenticateToken, createPost);
postsContentRoute.get("/:postId",
  validateParams(postIdSchema),
  authenticateToken,
  getPost
);
postsContentRoute.put("/:postId",
  validateBody(postSchema),
  validateParams(postIdSchema),
  authenticateToken,
  updatePost
);
postsContentRoute.get("/", getAllPosts);

export default postsContentRoute;
