/*
  Warnings:

  - A unique constraint covering the columns `[reviewerId,itemId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Review_reviewerId_itemId_key" ON "Review"("reviewerId", "itemId");
