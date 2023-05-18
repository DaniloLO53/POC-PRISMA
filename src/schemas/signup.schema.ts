import Joi from "joi";

const signupSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(6).required(),
  confirmPassword: Joi.valid(Joi.ref("password")).required(),
});

export default signupSchema;
