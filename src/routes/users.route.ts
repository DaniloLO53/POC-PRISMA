import express from "express";
import { getAllUsers } from "@/controllers";
import { validateBody } from "@/middlewares/schemaValidation.middleware";
import { usersSchema } from "@/schemas";

const usersRoute = express.Router();

usersRoute.post("/", validateBody(usersSchema));
usersRoute.get("/", getAllUsers);

export { usersRoute };
