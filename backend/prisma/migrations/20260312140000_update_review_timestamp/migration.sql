/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Review` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Review" DROP COLUMN "createdAt",
ADD COLUMN     "reviewedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
