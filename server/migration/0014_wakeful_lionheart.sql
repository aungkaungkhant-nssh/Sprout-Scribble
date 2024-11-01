ALTER TABLE "orderProduct" DROP CONSTRAINT "orderProduct_productVariantID_productVariants_id_fk";
--> statement-breakpoint
ALTER TABLE "orderProduct" DROP CONSTRAINT "orderProduct_productID_products_id_fk";
--> statement-breakpoint
ALTER TABLE "orderProduct" ADD COLUMN "productVariantId" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "orderProduct" ADD COLUMN "productId" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "paymentIntentId" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderProduct" ADD CONSTRAINT "orderProduct_productVariantId_productVariants_id_fk" FOREIGN KEY ("productVariantId") REFERENCES "public"."productVariants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderProduct" ADD CONSTRAINT "orderProduct_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "orderProduct" DROP COLUMN IF EXISTS "productVariantID";--> statement-breakpoint
ALTER TABLE "orderProduct" DROP COLUMN IF EXISTS "productID";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "paymentIntentID";