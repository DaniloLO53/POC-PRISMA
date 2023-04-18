import Joi from "joi";
import { IUserProperties } from "@/services/interfaces/IUsersProperties";

export const createUserSchema: Joi.ObjectSchema = Joi.object<IUserProperties>({
  name: Joi.string().trim().min(3).max(100).required(),
  email: Joi.string().trim().min(3).max(50).email().required(),
  password: Joi.string().trim().min(6).required(),
});

