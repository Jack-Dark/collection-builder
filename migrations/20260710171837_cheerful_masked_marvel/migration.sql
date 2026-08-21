ALTER TABLE "collection_items" ALTER COLUMN "edition_details" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "collection_items" ALTER COLUMN "edition_details" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "collection_items" ALTER COLUMN "notes" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "collection_items" ALTER COLUMN "notes" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "collection_items" ALTER COLUMN "custom_field1_value" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "collection_items" ALTER COLUMN "custom_field1_value" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "collection_items" ALTER COLUMN "custom_field2_value" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "collection_items" ALTER COLUMN "custom_field2_value" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "collection_items" ALTER COLUMN "custom_field3_value" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "collection_items" ALTER COLUMN "custom_field3_value" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "collection_items" ALTER COLUMN "user_id" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "collection_items" ADD COLUMN "images" json DEFAULT '[]'::json NOT NULL;