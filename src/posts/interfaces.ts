export interface Auth {
  author_id: number;
}

export interface PostId {
  post_id: number;
}

export interface CommentId {
  comment_id: number;
}

interface Content {
  content: string
}

interface Rate {
  type: "LIKE" | "DISLIKE";
}

export interface CreatePost extends Auth, Content {
  movie_imdb: string
}

export type UpdatePost = Partial<CreatePost> & PostId;

export type RatePost = PostId & Auth & Rate; 

export interface CreateComment extends Auth, PostId, Omit<CreatePost, "movie_imdb">{
  comment_id?: number
}

export interface UpdateComment extends Auth, Omit<CreatePost, "movie_imdb">{
  comment_id: number
}

export type RateComment = Auth & Rate & CommentId

export type DeleteComment = Auth & CommentId
