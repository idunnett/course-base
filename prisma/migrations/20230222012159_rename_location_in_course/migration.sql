/*
  Warnings:

  - You are about to drop the column `courseLocationId` on the `Course` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Course_courseLocationId_idx` ON `Course`;

-- AlterTable
ALTER TABLE `Course` DROP COLUMN `courseLocationId`,
    ADD COLUMN `locationId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Course_locationId_idx` ON `Course`(`locationId`);
