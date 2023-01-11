/*
  Warnings:

  - You are about to drop the column `courseIds` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "courseIds";

-- CreateTable
CREATE TABLE "UserCourse" (
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "detailsId" TEXT NOT NULL,

    CONSTRAINT "UserCourse_pkey" PRIMARY KEY ("userId","courseId","detailsId")
);

-- AddForeignKey
ALTER TABLE "UserCourse" ADD CONSTRAINT "UserCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCourse" ADD CONSTRAINT "UserCourse_detailsId_fkey" FOREIGN KEY ("detailsId") REFERENCES "CourseDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCourse" ADD CONSTRAINT "UserCourse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
