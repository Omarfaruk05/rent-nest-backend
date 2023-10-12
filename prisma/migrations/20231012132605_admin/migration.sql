/*
  Warnings:

  - You are about to drop the column `userId` on the `feedbacks` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `house_owners` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `house_renters` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `houseRenterId` to the `feedbacks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "feedbacks" DROP CONSTRAINT "feedbacks_userId_fkey";

-- DropForeignKey
ALTER TABLE "house_owners" DROP CONSTRAINT "house_owners_userId_fkey";

-- DropForeignKey
ALTER TABLE "house_renters" DROP CONSTRAINT "house_renters_userId_fkey";

-- DropIndex
DROP INDEX "house_owners_userId_key";

-- DropIndex
DROP INDEX "house_renters_userId_key";

-- AlterTable
ALTER TABLE "feedbacks" DROP COLUMN "userId",
ADD COLUMN     "houseRenterId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "house_owners" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "house_renters" DROP COLUMN "userId";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "RoleStatus" NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profileImage" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_houseRenterId_fkey" FOREIGN KEY ("houseRenterId") REFERENCES "house_renters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
