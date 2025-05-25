-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('MORNING', 'AFTERNOON', 'EVENING', 'FULL');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'RESIDENT', 'MESS');

-- CreateEnum
CREATE TYPE "CutType" AS ENUM ('MORNING', 'AFTERNOON', 'EVENING', 'FULL');

-- CreateEnum
CREATE TYPE "Building" AS ENUM ('DEVI_HOUSE', 'ROCKLAND_ARCADE');

-- CreateEnum
CREATE TYPE "Floor" AS ENUM ('TOP', 'GROUND');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "mealType" "MealType" NOT NULL,
    "role" "UserRole" NOT NULL,
    "isVeg" BOOLEAN NOT NULL,
    "hasOnboarded" BOOLEAN NOT NULL DEFAULT false,
    "adminVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messcut" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "cutType" "CutType" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Messcut_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resident" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "building" "Building" NOT NULL,
    "floor" "Floor" NOT NULL,

    CONSTRAINT "Resident_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Resident_userId_key" ON "Resident"("userId");

-- AddForeignKey
ALTER TABLE "Messcut" ADD CONSTRAINT "Messcut_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resident" ADD CONSTRAINT "Resident_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
