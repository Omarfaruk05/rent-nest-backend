/*
  Warnings:

  - You are about to drop the column `address` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "AvailabelStatus" AS ENUM ('AVAILABLE', 'BOOKED');

-- CreateEnum
CREATE TYPE "InteriorStatus" AS ENUM ('Furnished', 'Un_Furnished');

-- CreateEnum
CREATE TYPE "PropertyTypeStatus" AS ENUM ('Furnished', 'Residential', 'Luxury');

-- CreateEnum
CREATE TYPE "GasStatus" AS ENUM ('LPG', 'Govt');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'BOOKED');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "address",
DROP COLUMN "profileImage",
ALTER COLUMN "role" DROP DEFAULT;

-- CreateTable
CREATE TABLE "house_owners" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "RoleStatus" NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profileImage" TEXT,
    "address" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "house_owners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "house_renters" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "RoleStatus" NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profileImage" TEXT,
    "address" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "house_renters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "houses" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "roomSize" TEXT NOT NULL,
    "numberOfBalcony" INTEGER NOT NULL,
    "parking" INTEGER NOT NULL,
    "YearBuilt" INTEGER NOT NULL,
    "gas" "GasStatus" NOT NULL,
    "propertyType" "PropertyTypeStatus" NOT NULL,
    "interior" "InteriorStatus" NOT NULL,
    "status" "AvailabelStatus" NOT NULL DEFAULT 'AVAILABLE',
    "availabilityDate" TIMESTAMP(3) NOT NULL,
    "rentPerMonth" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "bookedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "houses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_and_ratings" (
    "id" TEXT NOT NULL,
    "review" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "houseRenterId" TEXT NOT NULL,
    "houseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "review_and_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booked_houses" (
    "id" TEXT NOT NULL,
    "houseRenterId" TEXT NOT NULL,
    "houseOwnerId" TEXT NOT NULL,
    "bookedHouseId" TEXT NOT NULL,
    "bookingStatus" "Status" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booked_houses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" TEXT NOT NULL,
    "feedback" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "house_owners_email_key" ON "house_owners"("email");

-- CreateIndex
CREATE UNIQUE INDEX "house_owners_userId_key" ON "house_owners"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "house_renters_email_key" ON "house_renters"("email");

-- CreateIndex
CREATE UNIQUE INDEX "house_renters_userId_key" ON "house_renters"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "house_owners" ADD CONSTRAINT "house_owners_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "house_renters" ADD CONSTRAINT "house_renters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "houses" ADD CONSTRAINT "houses_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "house_owners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "houses" ADD CONSTRAINT "houses_bookedById_fkey" FOREIGN KEY ("bookedById") REFERENCES "house_renters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_and_ratings" ADD CONSTRAINT "review_and_ratings_houseRenterId_fkey" FOREIGN KEY ("houseRenterId") REFERENCES "house_renters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_and_ratings" ADD CONSTRAINT "review_and_ratings_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "houses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booked_houses" ADD CONSTRAINT "booked_houses_houseRenterId_fkey" FOREIGN KEY ("houseRenterId") REFERENCES "house_renters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booked_houses" ADD CONSTRAINT "booked_houses_houseOwnerId_fkey" FOREIGN KEY ("houseOwnerId") REFERENCES "house_owners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booked_houses" ADD CONSTRAINT "booked_houses_bookedHouseId_fkey" FOREIGN KEY ("bookedHouseId") REFERENCES "houses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
