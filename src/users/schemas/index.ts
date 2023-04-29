import Joi from "joi";

const birthPattern = /^([0-9]{2})-([0-9]{2})-([0-9]{4})$/;

export interface IUserData {
  email: string,
  first_name: string,
  last_name: string,
  password: string,
  birth: string
}

export const signUpSchema = Joi.object({
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

export const signInSchema = Joi.object({
  email: Joi
    .string()
    .trim()
    .email()
    .error(() => new Error("Value must be an email"))
    .required(),
  password: Joi.string().trim().min(1).required(),
});

export const relashionshipSchema = Joi.object({
  follow: Joi
    .boolean()
    .error(() => new Error("Value must be an boolean"))
    .required(),
  idFromFollowed: Joi.number().required(),
});

export const userIdSchema = Joi.object(({
  userId: Joi.number().required(),
}));
