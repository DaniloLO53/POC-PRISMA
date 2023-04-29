import express from "express";
import postsContentRoute from "./content";
import postsCommentsRoute from "./comments";
import postRatingRoute from "./ratings/content";
import commentRatingRoute from "./ratings/comments";

const postsRoute = express.Router();

postsRoute
  .use(postsContentRoute)
  .use(postsCommentsRoute)
  .use(postRatingRoute)
  .use(commentRatingRoute);

export { postsRoute };
