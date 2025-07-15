CREATE TABLE `locations` (
	`id` integer PRIMARY KEY NOT NULL,
	`bibsNumber` text NOT NULL,
	`summary` text,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`result` text
);
--> statement-breakpoint
CREATE TABLE `runners` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`age` integer
);
