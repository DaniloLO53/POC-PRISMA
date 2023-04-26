import Joi from "joi";

export const postRatingSchema = Joi.object(({
  post_id: Joi.number().required(),
  type: Joi.valid("LIKE", "DISLIKE").required()
}));
