import express from "express";
import { getAllUsers, signUp, signIn } from "@/controllers";
import { validateBody } from "@/middlewares/schemaValidation.middleware";
import { signUpSchema, signInSchema } from "@/schemas";
import { setCookies } from "@/middlewares/setCookies.middleware";

const usersRoute = express.Router();

usersRoute.post("/sign-up", validateBody(signUpSchema), signUp);
usersRoute.post("/sign-in", validateBody(signInSchema), setCookies, signIn);
usersRoute.get("/", getAllUsers);

export { usersRoute };
