/*
  Warnings:

  - You are about to drop the `UserCourseDegreeLinks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `UserCourseDegreeLinks`;

-- CreateTable
CREATE TABLE `UserDegreeCourses` (
    `userId` VARCHAR(191) NOT NULL,
    `degreeId` VARCHAR(191) NOT NULL,
    `courseInfoId` VARCHAR(191) NOT NULL,
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `courseId` VARCHAR(191) NULL,
    `term` ENUM('F', 'W', 'S') NULL,
    `grade` DOUBLE NULL,

    INDEX `UserDegreeCourses_userId_idx`(`userId`),
    INDEX `UserDegreeCourses_degreeId_idx`(`degreeId`),
    INDEX `UserDegreeCourses_courseInfoId_idx`(`courseInfoId`),
    INDEX `UserDegreeCourses_courseId_idx`(`courseId`),
    PRIMARY KEY (`userId`, `courseInfoId`, `degreeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
