/*
  Warnings:

  - You are about to drop the column `is_approved` on the `comments` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."CommentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropIndex
DROP INDEX "public"."comments_is_approved_idx";

-- AlterTable
ALTER TABLE "public"."comments" DROP COLUMN "is_approved",
ADD COLUMN     "status" "public"."CommentStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "comments_status_idx" ON "public"."comments"("status");
