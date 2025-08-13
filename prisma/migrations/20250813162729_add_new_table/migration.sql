-- CreateTable
CREATE TABLE "public"."admin_verification_codes" (
    "id" TEXT NOT NULL,
    "code_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" TEXT,

    CONSTRAINT "admin_verification_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "admin_verification_codes_expires_at_idx" ON "public"."admin_verification_codes"("expires_at");

-- CreateIndex
CREATE INDEX "admin_verification_codes_used_idx" ON "public"."admin_verification_codes"("used");

-- CreateIndex
CREATE INDEX "admin_verification_codes_created_at_idx" ON "public"."admin_verification_codes"("created_at");
