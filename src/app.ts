import express, { Express } from "express";
import cors from "cors";
import { connectDb, disconnectDB, loadEnv } from "./config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { userRouter } from "./routes";

loadEnv();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use(errorHandler);

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;
