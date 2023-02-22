-- AlterTable
ALTER TABLE `Course` ADD COLUMN `courseLocationId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `CourseLocation` (
    `id` VARCHAR(191) NOT NULL,
    `lat` DOUBLE NOT NULL,
    `lng` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Course_courseLocationId_idx` ON `Course`(`courseLocationId`);
