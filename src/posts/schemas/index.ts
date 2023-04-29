import Joi from "joi";

const imdb_pattern = /^tt\d{7}$/;

export const postSchema = Joi.object(({
  content: Joi.string().trim().min(1).max(1024).required(),
  movie_imdb: Joi.string().pattern(new RegExp(imdb_pattern)).required()
}));

export const postIdSchema = Joi.object(({
  postId: Joi.number().required(),
}));

export const postRatingSchema = Joi.object(({
  post_id: Joi.number().required(),
  type: Joi
    .valid("LIKE", "DISLIKE")
    .required()
}));

export const commentSchema = Joi.object(({
  post_id: Joi.number().required(),
  comment_id: Joi.number(),
  content: Joi.string().trim().min(1).required()
}));

export const commentUpdateSchema = Joi.object(({
  content: Joi.string().trim().min(1).required()
}));

export const commentIdSchema = Joi.object(({
  commentId: Joi.number().required(),
}));

export const commentRatingSchema = Joi.object(({
  comment_id: Joi.number().required(),
  type: Joi.valid("LIKE", "DISLIKE").required()
}));
