ALTER TABLE "user" ADD COLUMN "twoFactorEnabled" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "isTwoFactorEnabled";