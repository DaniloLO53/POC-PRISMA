import { Post, PostRating } from "@prisma/client";
import { cannotModifyError } from "@/errors/cannotModifyError.errors";
import { postNotFoundError } from "@/errors/notFoundPost.errors";
import postsRepository from "@/repositories/posts";

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

export interface IPostDTO {
  content: string;
  author_id: number,
  movie_imdb: string
}

export interface IPostUpdateDTO extends IPostDTO {
  postId: string,
}

export interface IPostRateDTO {
  type: "LIKE" | "DISLIKE";
  author_id: number,
  post_id: string
}

const postsService = {
  createPost,
  updatePost,
  ratePost,
  getAllPosts,
  getPost
};

export default postsService;
