ALTER TABLE "user" ADD COLUMN "isTwoFactorEnabled" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "twoFactorEnabled";