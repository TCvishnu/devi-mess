/*
  Warnings:

  - A unique constraint covering the columns `[date,cutType,userId]` on the table `Messcut` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Messcut_date_cutType_userId_key" ON "Messcut"("date", "cutType", "userId");
