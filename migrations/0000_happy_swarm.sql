ALTER TABLE `locations` ADD COLUMN `status` text DEFAULT 'active' NOT NULL;
--> statement-breakpoint
-- CREATE TABLE `runners` (
-- 	`id` integer PRIMARY KEY NOT NULL,
-- 	`name` text NOT NULL,
-- 	`age` integer
-- );