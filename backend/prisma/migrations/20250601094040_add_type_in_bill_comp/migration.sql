/*
  Warnings:

  - Added the required column `type` to the `BillComponents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BillComponents" ADD COLUMN     "type" "BillType" NOT NULL;
