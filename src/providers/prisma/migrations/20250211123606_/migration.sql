/*
  Warnings:

  - A unique constraint covering the columns `[profileId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_nationalId_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_profileId_key" ON "User"("profileId");
