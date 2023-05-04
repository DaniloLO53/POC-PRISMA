import express from "express";
import { postIdSchema, postSchema } from "@/posts/schemas";
import { authenticateToken } from "@/middlewares/authentication.middleware";
import { validateBody, validateParams } from "@/middlewares/schemaValidation.middleware";
import {
  PostsCreateServices,
  PostsGetServices,
  PostsUpdateServices
} from "@/posts/services";
import { create, get, update } from "@/posts/controllers";

const { getPost } = PostsGetServices;
const { createPost } = PostsCreateServices;
const { updatePost } = PostsUpdateServices;

const postsContentRoute = express.Router();

postsContentRoute.post("/",
  validateBody(postSchema),
  authenticateToken,
  create(createPost)
);
postsContentRoute.get("/:post_id",
  validateParams(postIdSchema),
  authenticateToken,
  get(getPost)
);
postsContentRoute.put("/:post_id",
  validateBody(postSchema),
  validateParams(postIdSchema),
  authenticateToken,
  update(updatePost)
);
// postsContentRoute.get("/", getAllPosts);

export default postsContentRoute;
