import { Post } from "@prisma/client";
import { postNotFoundError } from "@/errors/notFoundPost.errors";
import postsRepository from "@/posts/repositories";
import { cannotModifyError } from "@/errors/cannotModifyError.errors";
import { IPostDTO, IPostUpdateDTO } from "@/posts/interfaces";

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
