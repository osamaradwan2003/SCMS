/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Guardian` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Guardian` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Guardian" ADD COLUMN     "email" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Guardian_phone_key" ON "public"."Guardian"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Guardian_email_key" ON "public"."Guardian"("email");
