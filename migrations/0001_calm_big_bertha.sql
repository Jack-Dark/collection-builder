CREATE TABLE "collections" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "games" RENAME TO "collections-items";--> statement-breakpoint
ALTER TABLE "collections-items" DROP CONSTRAINT "games_user_id_users_id_fk";
--> statement-breakpoint
DROP INDEX "games_userId_idx";--> statement-breakpoint
ALTER TABLE "collections-items" ADD COLUMN "collection_id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "collections" ADD CONSTRAINT "collections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "collections_userId_idx" ON "collections" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "collections-items" ADD CONSTRAINT "collections-items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collections-items" ADD CONSTRAINT "collections-items_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "collectionsItems_userId_idx" ON "collections-items" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "collectionsItems_collectionId_idx" ON "collections-items" USING btree ("collection_id");