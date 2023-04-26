import express from "express";
import {
  getAllUsers,
  signUp,
  signIn,
  createOrDestroyRelashionship
} from "@/users/controllers";
import { validateBody } from "@/middlewares/schemaValidation.middleware";
import { signUpSchema, signInSchema, relashionshipSchema } from "@/users/schemas";
import { authenticateToken } from "@/middlewares/authentication.middleware";

const usersRoute = express.Router();

usersRoute.post("/sign-up", validateBody(signUpSchema), signUp);
usersRoute.post("/sign-in", validateBody(signInSchema), signIn);

usersRoute.post("/relashionship",
  validateBody(relashionshipSchema),
  authenticateToken,
  createOrDestroyRelashionship
);
usersRoute.get("/", getAllUsers);

export { usersRoute };
