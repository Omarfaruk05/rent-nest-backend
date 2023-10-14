-- CreateEnum
CREATE TYPE "VisitSlot" AS ENUM ('MORNING', 'NOON', 'EVENING');

-- AlterTable
ALTER TABLE "blogs" ADD COLUMN     "blogImage" TEXT;

-- CreateTable
CREATE TABLE "house_visits" (
    "id" TEXT NOT NULL,
    "visitDate" TIMESTAMP(3) NOT NULL,
    "visitSlot" "VisitSlot" NOT NULL,
    "visitorId" TEXT NOT NULL,
    "houseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "house_visits_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "house_visits" ADD CONSTRAINT "house_visits_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "house_visits" ADD CONSTRAINT "house_visits_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "houses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
