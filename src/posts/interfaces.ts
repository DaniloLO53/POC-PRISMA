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

export interface ICommentDTO {
  author_id: number,
  content: string,
  post_id: string,
  comment_id?: number
}

export interface ICommentRateDTO {
  type: "LIKE" | "DISLIKE";
  author_id: number,
  comment_id: string
}

export interface ICommentUpdateDTO extends Omit<ICommentDTO, "post_id"> {
  commentId: string,
}

export interface ICommentDeleteDTO {
  id: number,
  author_id: number
}
