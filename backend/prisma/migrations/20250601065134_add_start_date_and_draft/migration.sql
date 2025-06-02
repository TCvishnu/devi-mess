/*
  Warnings:

  - Added the required column `draft` to the `UserBill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "startDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "UserBill" ADD COLUMN     "draft" BOOLEAN NOT NULL;
