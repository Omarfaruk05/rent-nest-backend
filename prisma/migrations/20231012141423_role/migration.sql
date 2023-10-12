/*
  Warnings:

  - Changed the type of `role` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "profileImage" TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL,
ALTER COLUMN "address" DROP NOT NULL;
