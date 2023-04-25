import Joi from "joi";

const imdb_pattern = /^tt\d{7}$/;

export const postSchema = Joi.object(({
  content: Joi.string().trim().min(1).max(1024).required(),
  author_id: Joi.number().required(),
  movie_imdb: Joi.string().pattern(new RegExp(imdb_pattern)).required()
}));
