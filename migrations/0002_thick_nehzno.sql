ALTER TABLE "collections-items" RENAME TO "collection-items";--> statement-breakpoint
ALTER TABLE "collection-items" DROP CONSTRAINT "collections-items_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "collection-items" DROP CONSTRAINT "collections-items_collection_id_collections_id_fk";
--> statement-breakpoint
ALTER TABLE "collection-items" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "collection-items" ADD CONSTRAINT "collection-items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection-items" ADD CONSTRAINT "collection-items_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;