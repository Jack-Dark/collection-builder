CREATE TABLE "collection_items_to_custom_field_values" (
	"collection_item_id" integer,
	"custom_field_value_id" integer,
	CONSTRAINT "collection_items_to_custom_field_values_pkey" PRIMARY KEY("collection_item_id","custom_field_value_id")
);
--> statement-breakpoint
CREATE TABLE "collections_to_custom_fields" (
	"collection_id" integer,
	"custom_field_id" integer,
	CONSTRAINT "collections_to_custom_fields_pkey" PRIMARY KEY("collection_id","custom_field_id")
);
--> statement-breakpoint
CREATE TABLE "custom_field_values" (
	"custom_field_id" integer NOT NULL,
	"id" serial PRIMARY KEY,
	"user_id" text DEFAULT '' NOT NULL,
	"value" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "custom_fields" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "collection_items_to_custom_field_values" ADD CONSTRAINT "collection_items_to_custom_field_values_BhloB1uTCQIO_fkey" FOREIGN KEY ("collection_item_id") REFERENCES "collection_items"("id");--> statement-breakpoint
ALTER TABLE "collection_items_to_custom_field_values" ADD CONSTRAINT "collection_items_to_custom_field_values_MhfYAFHJHSDA_fkey" FOREIGN KEY ("custom_field_value_id") REFERENCES "custom_field_values"("id");--> statement-breakpoint
ALTER TABLE "collections_to_custom_fields" ADD CONSTRAINT "collections_to_custom_fields_collection_id_collections_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id");--> statement-breakpoint
ALTER TABLE "collections_to_custom_fields" ADD CONSTRAINT "collections_to_custom_fields_NekodAvTyA0g_fkey" FOREIGN KEY ("custom_field_id") REFERENCES "custom_fields"("id");--> statement-breakpoint
ALTER TABLE "custom_field_values" ADD CONSTRAINT "custom_field_values_custom_field_id_custom_fields_id_fkey" FOREIGN KEY ("custom_field_id") REFERENCES "custom_fields"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "custom_field_values" ADD CONSTRAINT "custom_field_values_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "custom_fields" ADD CONSTRAINT "custom_fields_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;