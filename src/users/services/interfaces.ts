export type SignInData = "email" | "password";

export interface IRelashionshipDTO {
  follow: boolean;
  idFromFollowed: number,
  idFromFollower: number
}
