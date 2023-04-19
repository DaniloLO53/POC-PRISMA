import Joi from "joi";

export const usersSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  first_name: Joi.string().trim().min(1).pattern(/^\S+$/).required(),
  last_name: Joi.string().trim().min(1).required(),
  password: Joi.string().trim().min(1).required(),
  birth: Joi.date().required()
});
