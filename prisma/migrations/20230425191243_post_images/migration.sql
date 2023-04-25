/*
  Warnings:

  - You are about to drop the column `image_id` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the `PostImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_image_id_fkey";

-- DropIndex
DROP INDEX "Post_image_id_key";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "image_id";

-- DropTable
DROP TABLE "PostImage";

-- CreateTable
CREATE TABLE "PostImages" (
    "id" SERIAL NOT NULL,
    "content" BYTEA NOT NULL,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "PostImages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PostImages" ADD CONSTRAINT "PostImages_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
