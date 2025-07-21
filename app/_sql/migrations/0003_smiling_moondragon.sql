ALTER TABLE "profiles" ADD PRIMARY KEY ("profile_id");--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "profile_id" SET NOT NULL;