ALTER TABLE "collections" ALTER COLUMN "custom_field1_enabled" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "collections" ALTER COLUMN "custom_field2_enabled" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "collections" ALTER COLUMN "custom_field3_enabled" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "collections" ALTER COLUMN "notes" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "collection-items" ADD COLUMN "custom_field1_value" text;--> statement-breakpoint
ALTER TABLE "collection-items" ADD COLUMN "custom_field2_value" text;--> statement-breakpoint
ALTER TABLE "collection-items" ADD COLUMN "custom_field3_value" text;