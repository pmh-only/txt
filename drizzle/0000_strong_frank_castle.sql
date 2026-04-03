CREATE TABLE `post` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`alias` text NOT NULL,
	`visibility` text NOT NULL,
	`view_count` integer NOT NULL,
	`unique_count` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `post_alias_unique` ON `post` (`alias`);