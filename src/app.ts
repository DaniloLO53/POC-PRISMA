import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; 
import { connectPrisma, disconnectPrisma, loadEnv } from "./config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { postsRoute } from "./posts/routes";
import { usersRoute } from "./users/routes";

loadEnv();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app
  .use("/users", usersRoute)
  .use("/posts", postsRoute)
  .use(errorHandler);

export async function init(): Promise<Express> {
  connectPrisma();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectPrisma();
}

export default app;
