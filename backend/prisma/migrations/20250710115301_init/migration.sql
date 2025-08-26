/*
  Warnings:

  - Added the required column `address` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Made the column `guardianId` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subscriptionsId` on table `Student` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_guardianId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_subscriptionsId_fkey";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "docs" TEXT,
ADD COLUMN     "gender" CHAR(10),
ADD COLUMN     "image" TEXT,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "guardianId" SET NOT NULL,
ALTER COLUMN "subscriptionsId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_guardianId_fkey" FOREIGN KEY ("guardianId") REFERENCES "Guardian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_subscriptionsId_fkey" FOREIGN KEY ("subscriptionsId") REFERENCES "Subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
