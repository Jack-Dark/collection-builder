ALTER TABLE "collections" ADD COLUMN "custom_field1_enabled" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "custom_field1_label" text;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "custom_field2_enabled" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "custom_field2_label" text;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "custom_field3_enabled" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "custom_field3_label" text;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "notes" text;