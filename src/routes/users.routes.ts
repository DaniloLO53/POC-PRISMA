import express from "express";
import { validateBody } from "../middlewares/schemaValidation.middleware";
import { signup, signin } from "@/controllers/users";
import signupSchema from "@/schemas/signup.schema";
import signinSchema from "@/schemas/signin.schema";

const usersRoutes = express.Router();

usersRoutes.post("/sign-up", validateBody(signupSchema), signup);
usersRoutes.post("/sign-in", validateBody(signinSchema), signin);

export default usersRoutes;
