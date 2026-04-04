CREATE TABLE `view` (
	`id` integer NOT NULL,
	`ip` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `post_id` ON `view` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `view_id_ip_unique` ON `view` (`id`,`ip`);