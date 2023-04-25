import Joi from "joi";

export const postSchema = Joi.object(({
  content: Joi.string().trim().min(1).max(1024).required(),
  author_id: Joi.number().required()
}));
