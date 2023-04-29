import { Comment } from "@prisma/client";
import { cannotModifyError } from "@/errors/cannotModifyError.errors";
import { postNotFoundError } from "@/errors/notFoundPost.errors";
import { ICommentDTO, ICommentUpdateDTO } from "@/posts/interfaces";
import postsRepository from "@/posts/repositories";

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

export async function getPostComments(postId: string) {
  const post = await postsRepository.findPostById(postId);
  if (!post) throw postNotFoundError();

  const ratings = await postsRepository.findPostComments(postId);


  return ratings;
}

export async function countPostComments(postId: string) {
  const post = await postsRepository.findPostById(postId);
  if (!post) throw postNotFoundError();

  const ratingsQuantity = await postsRepository.countPostComments(postId);

  return ratingsQuantity;
}
