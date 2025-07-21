ALTER TABLE "profiles" RENAME COLUMN "id" TO "profile_id";--> statement-breakpoint
ALTER TABLE "profiles" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "profiles" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "profiles" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;