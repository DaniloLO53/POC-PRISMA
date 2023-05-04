import { Comment } from "@prisma/client";
import { cannotModifyError } from "@/errors/cannotModifyError.errors";
import { postNotFoundError } from "@/errors/notFoundPost.errors";
import postsRepository from "@/posts/repositories";
import {
  Auth,
  CreateComment,
  DeleteComment,
  PostId,
  UpdateComment
} from "@/posts/interfaces";

export async function comment({
  post_id, comment_id, author_id, content
}: CreateComment): Promise<Comment> {
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
  comment_id,
  author_id,
  content
}: UpdateComment): Promise<Comment> {
  const comment = await postsRepository.findCommentById(comment_id);

  if (!comment) throw postNotFoundError();
  if (comment.author_id !== author_id) throw cannotModifyError();

  return await postsRepository.updateComment({
    content,
    comment_id,
  });
}

export async function deleteComment({
  comment_id,
  author_id
}: DeleteComment): Promise<void> {
  const comment = await postsRepository.findCommentById(Number(comment_id));

  if (!comment) throw postNotFoundError();
  if (comment.author_id !== author_id) throw cannotModifyError();

  await postsRepository.deleteComment({ comment_id });
}

export async function getPostComments({ post_id, author_id }: Auth & PostId) {
  const post = await postsRepository.findPostById(post_id);

  if (!post) throw postNotFoundError();
  if (post.author_id !== author_id) throw cannotModifyError();

  const comments = await postsRepository.findPostComments(post_id);

  return comments;
}

export async function countPostComments({ post_id, author_id }: Auth & PostId) {
  const post = await postsRepository.findPostById(post_id);

  if (!post) throw postNotFoundError();
  if (post.author_id !== author_id) throw cannotModifyError();

  const commentsQuantity = await postsRepository.countPostComments(post_id);

  return { commentsQuantity };
}
