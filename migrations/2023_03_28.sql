ALTER TABLE `event_ticket_info` ADD `visibility` VARCHAR(50) NOT NULL AFTER `maximum_quantity`;
ALTER TABLE `event_ticket_info` ADD `sold` INT NOT NULL AFTER `quantity`;

ALTER TABLE `event` ADD `user_id` INT NOT NULL AFTER `id`;

ALTER TABLE `event` ADD CONSTRAINT `event_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

