import express from "express";
import {
  getAllUsers,
  signUp,
  signIn,
  createOrDestroyRelashionship,
  getPostsFromUser
} from "@/users/controllers";
import { validateBody, validateParams } from "@/middlewares/schemaValidation.middleware";
import {
  signUpSchema,
  signInSchema,
  relashionshipSchema,
  userIdSchema
} from "@/users/schemas";
import { authenticateToken } from "@/middlewares/authentication.middleware";

const usersRoute = express.Router();

usersRoute.post("/sign-up", validateBody(signUpSchema), signUp);
usersRoute.post("/sign-in", validateBody(signInSchema), signIn);

usersRoute.post("/relashionship",
  validateBody(relashionshipSchema),
  authenticateToken,
  createOrDestroyRelashionship
);
usersRoute.get("/:userId/posts",
  validateParams(userIdSchema),
  authenticateToken,
  getPostsFromUser
);

usersRoute.get("/", getAllUsers);

export { usersRoute };
