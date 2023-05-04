import { Post } from "@prisma/client";
import { postNotFoundError } from "@/errors/notFoundPost.errors";
import postsRepository from "@/posts/repositories";
import { cannotModifyError } from "@/errors/cannotModifyError.errors";
import { CreatePost, PostId, UpdatePost } from "@/posts/interfaces";

export async function getAllPosts() {
  const posts = await postsRepository.findAll();

  return posts;
}

export async function getPost({ post_id }: PostId) {
  const post = await postsRepository.findPostById(post_id);

  return post;
}

export async function createPost({
  content, author_id, movie_imdb
}: CreatePost): Promise<Post> {
  return await postsRepository.createPost({
    content,
    author_id,
    movie_imdb
  });
}

export async function updatePost({
  content, author_id, movie_imdb, post_id
}: UpdatePost): Promise<Post> {
  const post = await postsRepository.findPostById(post_id);

  if (!post) throw postNotFoundError();
  if (post.author_id !== author_id) throw cannotModifyError();

  return await postsRepository.updatePost({
    content,
    movie_imdb,
    post_id
  });
}
