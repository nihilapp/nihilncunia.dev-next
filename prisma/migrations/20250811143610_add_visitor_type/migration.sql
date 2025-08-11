/*
  Warnings:

  - The values [GUEST] on the enum `CommentAuthorType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `author_email` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `author_name` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `author_website` on the `comments` table. All the data in the column will be lost.
  - Made the column `user_id` on table `comments` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."GuestBookStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."ActivityType" AS ENUM ('COMMENT', 'LOGIN', 'PROFILE_UPDATE', 'GUESTBOOK_WRITE', 'POST_VIEW', 'EMAIL_NOTIFICATION_READ', 'GUESTBOOK_REPLY', 'PASSWORD_CHANGE', 'ACCOUNT_DEACTIVATE');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."CommentAuthorType_new" AS ENUM ('USER', 'ADMIN');
ALTER TABLE "public"."comments" ALTER COLUMN "author_type" DROP DEFAULT;
ALTER TABLE "public"."comments" ALTER COLUMN "author_type" TYPE "public"."CommentAuthorType_new" USING ("author_type"::text::"public"."CommentAuthorType_new");
ALTER TYPE "public"."CommentAuthorType" RENAME TO "CommentAuthorType_old";
ALTER TYPE "public"."CommentAuthorType_new" RENAME TO "CommentAuthorType";
DROP TYPE "public"."CommentAuthorType_old";
COMMIT;

-- AlterEnum
ALTER TYPE "public"."UserRole" ADD VALUE 'VISITOR';

-- DropForeignKey
ALTER TABLE "public"."comments" DROP CONSTRAINT "comments_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."comments" DROP COLUMN "author_email",
DROP COLUMN "author_name",
DROP COLUMN "author_website",
ALTER COLUMN "author_type" DROP DEFAULT,
ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "comment_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "email_notifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "last_comment_at" TIMESTAMP(3),
ADD COLUMN     "subscription_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "role" SET DEFAULT 'USER';

-- CreateTable
CREATE TABLE "public"."guest_activities" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "activity_type" "public"."ActivityType" NOT NULL,
    "activity_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guest_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."guest_books" (
    "id" TEXT NOT NULL,
    "author_name" TEXT NOT NULL,
    "author_email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "public"."GuestBookStatus" NOT NULL DEFAULT 'PENDING',
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guest_books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."guest_book_replies" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "guest_book_id" TEXT NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guest_book_replies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "guest_activities_user_id_idx" ON "public"."guest_activities"("user_id");

-- CreateIndex
CREATE INDEX "guest_activities_activity_type_idx" ON "public"."guest_activities"("activity_type");

-- CreateIndex
CREATE INDEX "guest_activities_created_at_idx" ON "public"."guest_activities"("created_at");

-- CreateIndex
CREATE INDEX "guest_books_author_email_idx" ON "public"."guest_books"("author_email");

-- CreateIndex
CREATE INDEX "guest_books_status_idx" ON "public"."guest_books"("status");

-- CreateIndex
CREATE INDEX "guest_books_user_id_idx" ON "public"."guest_books"("user_id");

-- CreateIndex
CREATE INDEX "guest_book_replies_guest_book_id_idx" ON "public"."guest_book_replies"("guest_book_id");

-- CreateIndex
CREATE INDEX "guest_book_replies_admin_id_idx" ON "public"."guest_book_replies"("admin_id");

-- CreateIndex
CREATE INDEX "guest_book_replies_is_public_idx" ON "public"."guest_book_replies"("is_public");

-- CreateIndex
CREATE INDEX "users_subscription_date_idx" ON "public"."users"("subscription_date");

-- CreateIndex
CREATE INDEX "users_comment_count_idx" ON "public"."users"("comment_count");

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."guest_activities" ADD CONSTRAINT "guest_activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."guest_books" ADD CONSTRAINT "guest_books_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."guest_book_replies" ADD CONSTRAINT "guest_book_replies_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."guest_book_replies" ADD CONSTRAINT "guest_book_replies_guest_book_id_fkey" FOREIGN KEY ("guest_book_id") REFERENCES "public"."guest_books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
