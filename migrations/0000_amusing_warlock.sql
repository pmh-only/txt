CREATE TABLE `post` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`content_preview` text,
	`alias` text NOT NULL,
	`visibility` text NOT NULL,
	`view_count` integer NOT NULL,
	`unique_count` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `post_alias_unique` ON `post` (`alias`);--> statement-breakpoint
CREATE TABLE `view` (
	`id` integer NOT NULL,
	`ip` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `post_id` ON `view` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `view_id_ip_unique` ON `view` (`id`,`ip`);