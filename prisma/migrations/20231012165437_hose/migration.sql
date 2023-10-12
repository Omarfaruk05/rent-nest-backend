-- DropForeignKey
ALTER TABLE "houses" DROP CONSTRAINT "houses_ownerId_fkey";

-- AddForeignKey
ALTER TABLE "houses" ADD CONSTRAINT "houses_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
