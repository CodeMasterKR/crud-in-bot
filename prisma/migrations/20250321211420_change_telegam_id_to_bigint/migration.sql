/*
  Warnings:

  - A unique constraint covering the columns `[telegamId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "telegamId" SET DATA TYPE BIGINT;

-- CreateIndex
CREATE UNIQUE INDEX "User_telegamId_key" ON "User"("telegamId");
