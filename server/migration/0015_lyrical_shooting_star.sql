ALTER TABLE "orderProduct" DROP CONSTRAINT "orderProduct_orderID_orders_id_fk";
--> statement-breakpoint
ALTER TABLE "orderProduct" ADD COLUMN "orderId" serial NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderProduct" ADD CONSTRAINT "orderProduct_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "orderProduct" DROP COLUMN IF EXISTS "orderID";