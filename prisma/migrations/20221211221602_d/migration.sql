/*
  Warnings:

  - The primary key for the `Course` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `courseCode` on the `CourseDetails` table. All the data in the column will be lost.
  - You are about to drop the column `courseSchoolId` on the `CourseDetails` table. All the data in the column will be lost.
  - The required column `id` was added to the `Course` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `courseId` to the `CourseDetails` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CourseDetails" DROP CONSTRAINT "CourseDetails_courseCode_courseSchoolId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP CONSTRAINT "Course_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Course_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CourseDetails" DROP COLUMN "courseCode",
DROP COLUMN "courseSchoolId",
ADD COLUMN     "courseId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CourseDetails" ADD CONSTRAINT "CourseDetails_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
