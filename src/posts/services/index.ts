import { createPost, getAllPosts, getPost , updatePost } from "./content";
import {
  comment,
  updateComment,
  deleteComment,
  getPostComments,
  countPostComments
} from "./comments";
import {
  rateComment,
  countPostCommentRatings,
  getPostCommentRatings
} from "./ratings/comments";
import { ratePost, getPostRatings , countPostRatings } from "./ratings/content";

const postsService = {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  comment,
  updateComment,
  deleteComment,
  rateComment,
  countPostCommentRatings,
  getPostCommentRatings,
  getPostComments,
  countPostComments,
  ratePost,
  getPostRatings,
  countPostRatings
};

export default postsService;
