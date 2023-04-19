import express from "express";
import { getAllUsers } from "@/controllers";

const usersRoute = express.Router();

usersRoute.get("/", getAllUsers);

export { usersRoute };
