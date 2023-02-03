-- Create table event
CREATE TABLE `event` (
  `id` int(11) NOT NULL,
  `title` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `slug` text NOT NULL,
  `date_start` date NOT NULL,
  `date_end` date NOT NULL,
  `time_start` time NOT NULL,
  `time_end` time NOT NULL,
  `cover_image_url` text NOT NULL,
  `summary` text NOT NULL,
  `description` text NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE `event`
ADD PRIMARY KEY (`id`);

ALTER TABLE `event`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- Create table event_location
CREATE TABLE `event_location` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `venue_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `address_1` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `address_2` varchar(150) COLLATE utf8_unicode_ci NULL,
  `city` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `state` varchar(80) COLLATE utf8_unicode_ci NULL,
  `postal_code` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `country` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `latitude` text NOT NULL,
  `longitude` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE `event_location`
ADD PRIMARY KEY (`id`);

ALTER TABLE `event_location`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `event_location` ADD CONSTRAINT `event_location_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Create table event_ticket_info
CREATE TABLE `event_ticket_info` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `type` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` float NOT NULL,
  `sales_start` date NOT NULL,
  `sales_end` date NOT NULL,
  `time_start` time NOT NULL,
  `time_end` time NOT NULL,
  `description` text NULL,
  `minimum_quantity` int(11) NOT NULL,
  `maximum_quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE `event_ticket_info`
ADD PRIMARY KEY (`id`);

ALTER TABLE `event_ticket_info`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `event_ticket_info` ADD CONSTRAINT `event_ticket_info_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Create table event_tag
CREATE TABLE `event_tag` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE `event_tag`
ADD PRIMARY KEY (`id`);

ALTER TABLE `event_tag`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `event_tag` ADD CONSTRAINT `event_tag_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;