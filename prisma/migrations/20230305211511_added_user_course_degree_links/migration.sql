-- CreateTable
CREATE TABLE `UserCourseDegreeLinks` (
    `userId` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `degreeId` VARCHAR(191) NOT NULL,

    INDEX `UserCourseDegreeLinks_userId_idx`(`userId`),
    INDEX `UserCourseDegreeLinks_courseId_idx`(`courseId`),
    INDEX `UserCourseDegreeLinks_degreeId_idx`(`degreeId`),
    PRIMARY KEY (`userId`, `courseId`, `degreeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
