/*
  Warnings:

  - The values [ADMIN,HOUSE_OWNER,HOUSE_RENTER] on the enum `RoleStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RoleStatus_new" AS ENUM ('admin', 'house_owner', 'house_renter');
ALTER TABLE "admins" ALTER COLUMN "role" TYPE "RoleStatus_new" USING ("role"::text::"RoleStatus_new");
ALTER TABLE "house_owners" ALTER COLUMN "role" TYPE "RoleStatus_new" USING ("role"::text::"RoleStatus_new");
ALTER TABLE "house_renters" ALTER COLUMN "role" TYPE "RoleStatus_new" USING ("role"::text::"RoleStatus_new");
ALTER TYPE "RoleStatus" RENAME TO "RoleStatus_old";
ALTER TYPE "RoleStatus_new" RENAME TO "RoleStatus";
DROP TYPE "RoleStatus_old";
COMMIT;
