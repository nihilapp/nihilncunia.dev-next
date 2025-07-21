drop table "profiles";

CREATE TABLE "profiles" (
	"profile_id" uuid,
	"email" text NOT NULL,
	"role" "profile_role" DEFAULT 'USER',
	"username" text NOT NULL,
	"image" text DEFAULT '',
	"bio" text DEFAULT '',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "profiles_email_unique" UNIQUE("email"),
	CONSTRAINT "profiles_username_unique" UNIQUE("username")
);

ALTER TABLE "profiles" ADD CONSTRAINT "profiles_profile_id_users_id_fk" FOREIGN KEY ("profile_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
