import Joi from "joi";

export const postIdSchema = Joi.object(({
  post_id: Joi.number().required(),
  type: Joi.valid(["LIKE", "DISLIKE"]).required()
}));
