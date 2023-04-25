/*
  Warnings:

  - Added the required column `movie_imdb` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "movie_imdb" TEXT NOT NULL;
