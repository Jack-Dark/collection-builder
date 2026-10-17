ALTER TABLE "collection_items_to_custom_field_values" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "collection_items_to_custom_field_values" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "collections_to_custom_fields" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "collections_to_custom_fields" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;