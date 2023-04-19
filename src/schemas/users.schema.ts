import Joi from "joi";

const birthPattern = /^([0-9]{2})-([0-9]{2})-([0-9]{4})$/;

export const usersSchema = Joi.object({
  email: Joi
    .string()
    .trim()
    .email()
    .error(() => new Error("Value must be an email"))
    .required(),
  first_name: Joi.string().trim().min(1).pattern(/^\S+$/).required(),
  last_name: Joi.string().trim().min(1).required(),
  password: Joi.string().trim().min(1).required(),
  birth: Joi.string().trim().pattern(new RegExp(birthPattern)).required()
});
