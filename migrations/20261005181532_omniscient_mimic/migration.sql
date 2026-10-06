ALTER TABLE "collection_items_to_custom_field_values" ALTER COLUMN "collection_item_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "collection_items_to_custom_field_values" ALTER COLUMN "custom_field_value_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "collection_items_to_custom_field_values" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "collections" ALTER COLUMN "notes" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "collections_to_custom_fields" ALTER COLUMN "collection_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "collections_to_custom_fields" ALTER COLUMN "custom_field_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "collections_to_custom_fields" ALTER COLUMN "order" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "collections_to_custom_fields" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "custom_field_values" ALTER COLUMN "user_id" DROP DEFAULT;