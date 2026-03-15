/*
  Warnings:

  - Made the column `pfpUrl` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "pfpUrl" SET NOT NULL,
ALTER COLUMN "pfpUrl" SET DEFAULT '/uploads/default-pfp.png';
