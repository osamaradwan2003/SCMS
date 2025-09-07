/*
 Warnings:
 
 - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
 
 */
-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_bankId_fkey";
-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_categoryId_fkey";
-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_expenseTypeId_fkey";
-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_incomeTypeId_fkey";
-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_userId_fkey";
-- AlterTable
ALTER TABLE "public"."ExpenseType"
ADD COLUMN "description" TEXT;
-- DropTable
DROP TABLE "public"."Transaction";
-- CreateTable
CREATE TABLE "public"."Transaction" (
  "id" UUID NOT NULL,
  "categoryId" UUID NOT NULL,
  "bankId" UUID NOT NULL,
  "incomeTypeId" UUID,
  "expenseTypeId" UUID,
  "date" TIMESTAMP(3) NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL,
  "note" TEXT,
  "userId" UUID,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
-- AddForeignKey
ALTER TABLE "public"."Transaction"
ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."Transaction"
ADD CONSTRAINT "Transaction_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "public"."Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."Transaction"
ADD CONSTRAINT "Transaction_incomeTypeId_fkey" FOREIGN KEY ("incomeTypeId") REFERENCES "public"."IncomeType"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."Transaction"
ADD CONSTRAINT "Transaction_expenseTypeId_fkey" FOREIGN KEY ("expenseTypeId") REFERENCES "public"."ExpenseType"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."Transaction"
ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE
SET NULL ON UPDATE CASCADE;