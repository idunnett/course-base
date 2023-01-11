/*
  Warnings:

  - You are about to drop the column `courseCode` on the `Segment` table. All the data in the column will be lost.
  - You are about to drop the column `courseSchoolId` on the `Segment` table. All the data in the column will be lost.
  - Made the column `courseDetailsId` on table `Segment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Segment" DROP CONSTRAINT "Segment_courseDetailsId_fkey";

-- AlterTable
ALTER TABLE "Segment" DROP COLUMN "courseCode",
DROP COLUMN "courseSchoolId",
ALTER COLUMN "courseDetailsId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Segment" ADD CONSTRAINT "Segment_courseDetailsId_fkey" FOREIGN KEY ("courseDetailsId") REFERENCES "CourseDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
