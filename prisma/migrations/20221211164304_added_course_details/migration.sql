/*
  Warnings:

  - The primary key for the `Course` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `instructor` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `memberCount` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `term` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Course` table. All the data in the column will be lost.
  - Added the required column `courseCode` to the `Segment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseSchoolId` to the `Segment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Segment" DROP CONSTRAINT "Segment_courseId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP CONSTRAINT "Course_pkey",
DROP COLUMN "id",
DROP COLUMN "instructor",
DROP COLUMN "memberCount",
DROP COLUMN "term",
DROP COLUMN "year",
ADD CONSTRAINT "Course_pkey" PRIMARY KEY ("code", "schoolId");

-- AlterTable
ALTER TABLE "Segment" ADD COLUMN     "courseCode" TEXT NOT NULL,
ADD COLUMN     "courseDetailsId" TEXT,
ADD COLUMN     "courseSchoolId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "CourseDetails" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "term" "Term" NOT NULL DEFAULT E'F',
    "instructor" TEXT NOT NULL,
    "memberCount" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "courseCode" TEXT NOT NULL,
    "courseSchoolId" TEXT NOT NULL,

    CONSTRAINT "CourseDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CourseDetails" ADD CONSTRAINT "CourseDetails_courseCode_courseSchoolId_fkey" FOREIGN KEY ("courseCode", "courseSchoolId") REFERENCES "Course"("code", "schoolId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Segment" ADD CONSTRAINT "Segment_courseDetailsId_fkey" FOREIGN KEY ("courseDetailsId") REFERENCES "CourseDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;
