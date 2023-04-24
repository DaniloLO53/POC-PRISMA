import express from "express";
import { getAllUsers, signUp, signIn, createOrDestroyRelashionship } from "@/controllers";
import { validateBody } from "@/middlewares/schemaValidation.middleware";
import { signUpSchema, signInSchema, relashionshipSchema } from "@/schemas";
import { setCookies } from "@/middlewares/setCookies.middleware";
import { authenticateToken } from "@/middlewares/authentication.middleware";

const usersRoute = express.Router();

usersRoute.post("/sign-up", validateBody(signUpSchema), signUp);
usersRoute.post("/sign-in", validateBody(signInSchema), setCookies, signIn);

usersRoute.post("/relashionship",
  validateBody(relashionshipSchema),
  authenticateToken,
  createOrDestroyRelashionship
);
usersRoute.get("/", getAllUsers);

export { usersRoute };
