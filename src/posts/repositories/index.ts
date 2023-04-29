import { createPost, findAll, findPostById, updatePost } from "./content";
import {
  comment,
  updateComment,
  deleteComment,
  findCommentById,
  findPostComments,
  countPostComments
} from "./comments";
import {
  rateComment,
  findPostCommentRatings,
  countPostCommentRatings
} from "./ratings/comments";
import { ratePost, findPostRatings, countPostRatings } from "./ratings/content";

const postsRepository = {
  findAll,
  findPostById,
  createPost,
  updatePost,
  comment,
  updateComment,
  deleteComment,
  rateComment,
  findPostCommentRatings,
  countPostCommentRatings,
  findCommentById,
  findPostComments,
  countPostComments,
  ratePost,
  findPostRatings,
  countPostRatings,
};

export default postsRepository;
