import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; 
import { connectPrisma, disconnectPrisma, loadEnv } from "./config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import usersRoutes from "./routes/users.routes";

loadEnv();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app
  .use(usersRoutes)
  .use(errorHandler);

export async function init(): Promise<Express> {
  connectPrisma();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectPrisma();
}

export default app;
