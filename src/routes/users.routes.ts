import { Router } from "express";
import { createUserSchema } from "@/schemas/users.schemas";
import { validateBody } from "@/middlewares/validateSchema.middleware";
import { usersPost } from "@/controllers/users.controllers";

const userRouter = Router();

userRouter.post("/", validateBody(createUserSchema), usersPost);

export { userRouter };
