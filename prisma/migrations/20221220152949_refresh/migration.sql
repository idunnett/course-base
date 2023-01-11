/*
  Warnings:

  - You are about to drop the column `code` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `credits` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `degreeYear` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `schoolId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `courseDetailsId` on the `Segment` table. All the data in the column will be lost.
  - You are about to drop the `CourseDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserCourse` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `infoId` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instructor` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseId` to the `Segment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "CourseDetails" DROP CONSTRAINT "CourseDetails_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Segment" DROP CONSTRAINT "Segment_courseDetailsId_fkey";

-- DropForeignKey
ALTER TABLE "UserCourse" DROP CONSTRAINT "UserCourse_courseId_fkey";

-- DropForeignKey
ALTER TABLE "UserCourse" DROP CONSTRAINT "UserCourse_detailsId_fkey";

-- DropForeignKey
ALTER TABLE "UserCourse" DROP CONSTRAINT "UserCourse_userId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "code",
DROP COLUMN "color",
DROP COLUMN "credits",
DROP COLUMN "degreeYear",
DROP COLUMN "name",
DROP COLUMN "schoolId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "infoId" TEXT NOT NULL,
ADD COLUMN     "instructor" TEXT NOT NULL,
ADD COLUMN     "members" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "term" "Term" NOT NULL DEFAULT E'F',
ADD COLUMN     "year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Segment" DROP COLUMN "courseDetailsId",
ADD COLUMN     "courseId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "courseIds" TEXT[];

-- DropTable
DROP TABLE "CourseDetails";

-- DropTable
DROP TABLE "UserCourse";

-- CreateTable
CREATE TABLE "CourseInfo" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "degreeYear" INTEGER NOT NULL,
    "credits" DOUBLE PRECISION NOT NULL,
    "schoolId" TEXT NOT NULL,

    CONSTRAINT "CourseInfo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CourseInfo" ADD CONSTRAINT "CourseInfo_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_infoId_fkey" FOREIGN KEY ("infoId") REFERENCES "CourseInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Segment" ADD CONSTRAINT "Segment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
