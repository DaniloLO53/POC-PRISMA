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

export enum PostsUpdateServices {
  updatePost = "updatePost",
  updateComment = "updateComment",
  rateComment = "rateComment",
  ratePost = "ratePost",
}

export enum PostsRemoveServices {
  deleteComment = "deleteComment",
}

export enum PostsCreateServices {
  createPost = "createPost",
  comment = "comment",
  rateComment = "rateComment",
  ratePost = "ratePost",
}

export enum PostsGetServices {
  getAllPosts = "getAllPosts",
  getPost = "getPost",
  countPostCommentRatings = "countPostCommentRatings",
  getPostCommentRatings = "getPostCommentRatings",
  getPostComments = "getPostComments",
  countPostComments = "countPostComments",
  getPostRatings = "getPostRatings",
  countPostRatings = "countPostRatings"
}

export default postsService;
