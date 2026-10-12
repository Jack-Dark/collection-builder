ALTER TABLE "accounts" DROP COLUMN "deleted_at";--> statement-breakpoint
ALTER TABLE "collection_items" DROP COLUMN "deleted_at";--> statement-breakpoint
ALTER TABLE "collections" DROP COLUMN "deleted_at";--> statement-breakpoint
ALTER TABLE "custom_field_values" DROP COLUMN "deleted_at";--> statement-breakpoint
ALTER TABLE "custom_fields" DROP COLUMN "deleted_at";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "deleted_at";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "deleted_at";--> statement-breakpoint
ALTER TABLE "verifications" DROP COLUMN "deleted_at";