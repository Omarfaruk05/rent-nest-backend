/*
  Warnings:

  - You are about to drop the column `YearBuilt` on the `houses` table. All the data in the column will be lost.
  - You are about to drop the column `bookedById` on the `houses` table. All the data in the column will be lost.
  - You are about to drop the column `contactNumber` on the `houses` table. All the data in the column will be lost.
  - Added the required column `yearBuilt` to the `houses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "houses" DROP CONSTRAINT "houses_bookedById_fkey";

-- AlterTable
ALTER TABLE "houses" DROP COLUMN "YearBuilt",
DROP COLUMN "bookedById",
DROP COLUMN "contactNumber",
ADD COLUMN     "yearBuilt" INTEGER NOT NULL;
