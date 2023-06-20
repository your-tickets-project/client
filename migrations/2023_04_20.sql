ALTER TABLE `user` CHANGE `password` `password` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE `event` ADD `cancelled` BOOLEAN NOT NULL AFTER `is_available`;
ALTER TABLE `event` DROP `cover_image_url`;
ALTER TABLE `event` DROP `summary`;
ALTER TABLE `event` DROP `description`;

-- Create table orders
CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `unique_id` int(11) NOT NULL,
  `first_name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `purchase_date` date NOT NULL,
  `purchase_time` time NOT NULL,
  `total` float NOT NULL,
  `total_tickets` int(11) NOT NULL,
  `ticket_url` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `is_available` BOOLEAN NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE `orders`
ADD PRIMARY KEY (`id`);

ALTER TABLE `orders`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `orders` ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `orders` ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `orders` ADD UNIQUE(`unique_id`);

-- Create table orders_ticket_info
CREATE TABLE `orders_ticket_info` (
  `id` int(11) NOT NULL,
  `orders_id` int(11) NOT NULL,
  `event_ticket_info_id` int(11) NOT NULL,
  `ticket_amount` int(11) NOT NULL,
  `total_price` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE `orders_ticket_info`
ADD PRIMARY KEY (`id`);

ALTER TABLE `orders_ticket_info`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `orders_ticket_info` ADD CONSTRAINT `orders_ticket_info_ibfk_1` FOREIGN KEY (`orders_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `orders_ticket_info` ADD CONSTRAINT `orders_ticket_info_ibfk_2` FOREIGN KEY (`event_ticket_info_id`) REFERENCES `event_ticket_info`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;