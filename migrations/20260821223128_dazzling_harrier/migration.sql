DROP INDEX "accounts_userId_idx";--> statement-breakpoint
DROP INDEX "collectionsItems_userId_idx";--> statement-breakpoint
DROP INDEX "collectionsItems_collectionId_idx";--> statement-breakpoint
DROP INDEX "collections_userId_idx";--> statement-breakpoint
DROP INDEX "sessions_userId_idx";--> statement-breakpoint
DROP INDEX "verifications_identifier_idx";--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "verifications" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "accounts" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "issuer" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "updated_at" SET DEFAULT now();