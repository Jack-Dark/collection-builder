ALTER TABLE "collection_items_to_custom_field_values" ADD COLUMN "id" serial;--> statement-breakpoint
ALTER TABLE "collections_to_custom_fields" ADD COLUMN "id" serial;--> statement-breakpoint
ALTER TABLE "collection_items_to_custom_field_values" DROP CONSTRAINT "collection_items_to_custom_field_values_pkey";--> statement-breakpoint
ALTER TABLE "collection_items_to_custom_field_values" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "collections_to_custom_fields" DROP CONSTRAINT "collections_to_custom_fields_pkey";--> statement-breakpoint
ALTER TABLE "collections_to_custom_fields" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "collection_items_to_custom_field_values" ALTER COLUMN "collection_item_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "collection_items_to_custom_field_values" ALTER COLUMN "custom_field_value_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "collections_to_custom_fields" ALTER COLUMN "collection_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "collections_to_custom_fields" ALTER COLUMN "custom_field_id" DROP NOT NULL;