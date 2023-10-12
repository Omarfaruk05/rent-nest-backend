/*
  Warnings:

  - You are about to drop the column `bookedHouseId` on the `booked_houses` table. All the data in the column will be lost.
  - You are about to drop the column `houseOwnerId` on the `booked_houses` table. All the data in the column will be lost.
  - You are about to drop the column `houseRenterId` on the `booked_houses` table. All the data in the column will be lost.
  - You are about to drop the column `houseRenterId` on the `feedbacks` table. All the data in the column will be lost.
  - You are about to drop the column `houseRenterId` on the `review_and_ratings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[houseId]` on the table `booked_houses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `houseId` to the `booked_houses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `booked_houses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `feedbacks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `review_and_ratings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "booked_houses" DROP CONSTRAINT "booked_houses_bookedHouseId_fkey";

-- DropForeignKey
ALTER TABLE "booked_houses" DROP CONSTRAINT "booked_houses_houseOwnerId_fkey";

-- DropForeignKey
ALTER TABLE "booked_houses" DROP CONSTRAINT "booked_houses_houseRenterId_fkey";

-- DropForeignKey
ALTER TABLE "feedbacks" DROP CONSTRAINT "feedbacks_houseRenterId_fkey";

-- DropForeignKey
ALTER TABLE "review_and_ratings" DROP CONSTRAINT "review_and_ratings_houseRenterId_fkey";

-- AlterTable
ALTER TABLE "booked_houses" DROP COLUMN "bookedHouseId",
DROP COLUMN "houseOwnerId",
DROP COLUMN "houseRenterId",
ADD COLUMN     "houseId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "feedbacks" DROP COLUMN "houseRenterId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "review_and_ratings" DROP COLUMN "houseRenterId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "booked_houses_houseId_key" ON "booked_houses"("houseId");

-- AddForeignKey
ALTER TABLE "review_and_ratings" ADD CONSTRAINT "review_and_ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booked_houses" ADD CONSTRAINT "booked_houses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booked_houses" ADD CONSTRAINT "booked_houses_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "houses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
