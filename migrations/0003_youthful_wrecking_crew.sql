ALTER TABLE "collection-items" RENAME TO "collection_items";--> statement-breakpoint
ALTER TABLE "collection_items" DROP CONSTRAINT "collection-items_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "collection_items" DROP CONSTRAINT "collection-items_collection_id_collections_id_fk";
--> statement-breakpoint
ALTER TABLE "collection_items" ADD CONSTRAINT "collection_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_items" ADD CONSTRAINT "collection_items_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_items" DROP COLUMN "system";