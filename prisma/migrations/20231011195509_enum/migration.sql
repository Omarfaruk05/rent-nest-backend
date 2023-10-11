/*
  Warnings:

  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RoleStatus" AS ENUM ('ADMIN', 'HOUSE_OWNER', 'HOUSE_RENTER');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" "RoleStatus" NOT NULL DEFAULT 'HOUSE_RENTER';
