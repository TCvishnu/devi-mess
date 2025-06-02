/*
  Warnings:

  - The values [MORNING,AFTERNOON,EVENING,FULL] on the enum `CutType` will be removed. If these variants are still used in the database, this will fail.
  - The values [MORNING,AFTERNOON,EVENING,FULL] on the enum `MealType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "BillType" AS ENUM ('RENT', 'ELECTRICITY', 'WIFI', 'MORNING_MEAL', 'AFTERNOON_MEAL', 'EVENING_MEAL', 'FULL_MEAL');

-- AlterEnum
BEGIN;
CREATE TYPE "CutType_new" AS ENUM ('MORNING_MEAL', 'AFTERNOON_MEAL', 'EVENING_MEAL', 'FULL_MEAL');
ALTER TABLE "Messcut" ALTER COLUMN "cutType" TYPE "CutType_new" USING ("cutType"::text::"CutType_new");
ALTER TYPE "CutType" RENAME TO "CutType_old";
ALTER TYPE "CutType_new" RENAME TO "CutType";
DROP TYPE "CutType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "MealType_new" AS ENUM ('MORNING_MEAL', 'AFTERNOON_MEAL', 'EVENING_MEAL', 'FULL_MEAL');
ALTER TABLE "User" ALTER COLUMN "mealType" TYPE "MealType_new" USING ("mealType"::text::"MealType_new");
ALTER TYPE "MealType" RENAME TO "MealType_old";
ALTER TYPE "MealType_new" RENAME TO "MealType";
DROP TYPE "MealType_old";
COMMIT;

-- CreateTable
CREATE TABLE "UserBill" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserBill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillComponents" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userBillid" TEXT NOT NULL,
    "totalDays" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BillComponents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBillTypeConfiguration" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "billTypeConfigurationId" TEXT NOT NULL,
    "overriddenAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "UserBillTypeConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillTypeConfiguration" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "BillType" NOT NULL,
    "classifier" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BillTypeConfiguration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserBill" ADD CONSTRAINT "UserBill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillComponents" ADD CONSTRAINT "BillComponents_userBillid_fkey" FOREIGN KEY ("userBillid") REFERENCES "UserBill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBillTypeConfiguration" ADD CONSTRAINT "UserBillTypeConfiguration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBillTypeConfiguration" ADD CONSTRAINT "UserBillTypeConfiguration_billTypeConfigurationId_fkey" FOREIGN KEY ("billTypeConfigurationId") REFERENCES "BillTypeConfiguration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
