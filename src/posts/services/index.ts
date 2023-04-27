import { Comment, CommentRating, Post, PostRating } from "@prisma/client";
import {
  ICommentDTO,
  ICommentRateDTO,
  ICommentUpdateDTO,
  IPostDTO,
  IPostRateDTO,
  IPostUpdateDTO
} from "./interfaces";
import { cannotModifyError } from "@/errors/cannotModifyError.errors";
import { postNotFoundError } from "@/errors/notFoundPost.errors";
import postsRepository from "@/posts/repositories";

export async function getAllPosts() {
  const posts = await postsRepository.findAll();

  return posts;
}

export async function getPost(postId: string) {
  const post = await postsRepository.findPostById(postId);

  return post;
}

export async function createPost({
  content, author_id, movie_imdb
}: IPostDTO): Promise<Post> {
  return await postsRepository.createPost({
    content,
    author_id,
    movie_imdb
  });
}

export async function updatePost({
  content, author_id, movie_imdb, postId
}: IPostUpdateDTO): Promise<Post> {
  const post = await postsRepository.findPostById(postId);

  if (!post) throw postNotFoundError();
  if (post.author_id !== author_id) throw cannotModifyError();

  return await postsRepository.updatePost({
    content,
    movie_imdb,
    postId
  });
}

export async function ratePost({
  post_id, author_id, type
}: IPostRateDTO): Promise<PostRating> {
  const post = await postsRepository.findPostById(post_id);

  if (!post) throw postNotFoundError();

  return await postsRepository.ratePost({
    author_id,
    type,
    post_id
  });
}

export async function comment({
  post_id, comment_id, author_id, content
}: ICommentDTO): Promise<Comment> {
  let comment;

  comment_id && (comment = await postsRepository.findCommentById(comment_id));
  const post = await postsRepository.findPostById(post_id);

  if (!post || (!comment && comment_id)) throw postNotFoundError();

  return await postsRepository.comment({
    author_id,
    content,
    post_id,
    comment_id
  });
}

export async function updateComment({
  content, author_id, commentId
}: ICommentUpdateDTO): Promise<Comment> {
  const comment = await postsRepository.findCommentById(Number(commentId));

  if (!comment) throw postNotFoundError();
  if (comment.author_id !== author_id) throw cannotModifyError();

  return await postsRepository.updateComment({
    content,
    commentId,
  });
}

export async function deleteComment({
  author_id, commentId
}: Omit<ICommentUpdateDTO, "content">): Promise<void> {
  const comment = await postsRepository.findCommentById(Number(commentId));

  if (!comment) throw postNotFoundError();
  if (comment.author_id !== author_id) throw cannotModifyError();

  await postsRepository.deleteComment({
    commentId,
  });
}

export async function rateComment({
  comment_id, author_id, type
}: ICommentRateDTO): Promise<CommentRating> {
  const comment = await postsRepository.findCommentById(Number(comment_id));

  if (!comment) throw postNotFoundError();

  return await postsRepository.rateComment({
    author_id,
    type,
    comment_id
  });
}

const postsService = {
  createPost,
  comment,
  updateComment,
  deleteComment,
  rateComment,
  updatePost,
  ratePost,
  getAllPosts,
  getPost
};

export default postsService;
