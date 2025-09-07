/*
 Warnings:
 
 - Added the required column `updated_at` to the `Bank` table without a default value. This is not possible if the table is not empty.
 - Added the required column `userId` to the `Bank` table without a default value. This is not possible if the table is not empty.
 - Added the required column `updated_at` to the `Category` table without a default value. This is not possible if the table is not empty.
 - Added the required column `userId` to the `Category` table without a default value. This is not possible if the table is not empty.
 - Added the required column `updated_at` to the `Class` table without a default value. This is not possible if the table is not empty.
 - Added the required column `userId` to the `Class` table without a default value. This is not possible if the table is not empty.
 - Added the required column `updated_at` to the `Employee` table without a default value. This is not possible if the table is not empty.
 - Added the required column `userId` to the `Employee` table without a default value. This is not possible if the table is not empty.
 - Added the required column `updated_at` to the `EmployeeAttendance` table without a default value. This is not possible if the table is not empty.
 - Added the required column `userId` to the `EmployeeAttendance` table without a default value. This is not possible if the table is not empty.
 - Added the required column `updated_at` to the `ExpenseType` table without a default value. This is not possible if the table is not empty.
 - Added the required column `userId` to the `ExpenseType` table without a default value. This is not possible if the table is not empty.
 - Added the required column `updated_at` to the `Guardian` table without a default value. This is not possible if the table is not empty.
 - Added the required column `userId` to the `Guardian` table without a default value. This is not possible if the table is not empty.
 - Added the required column `updated_at` to the `IncomeType` table without a default value. This is not possible if the table is not empty.
 - Added the required column `userId` to the `IncomeType` table without a default value. This is not possible if the table is not empty.
 - Added the required column `updated_at` to the `MessageLog` table without a default value. This is not possible if the table is not empty.
 - Added the required column `updated_at` to the `Payroll` table without a default value. This is not possible if the table is not empty.
 - Added the required column `userId` to the `Payroll` table without a default value. This is not possible if the table is not empty.
 - Added the required column `updated_at` to the `Student` table without a default value. This is not possible if the table is not empty.
 - Added the required column `userId` to the `Student` table without a default value. This is not possible if the table is not empty.
 - Added the required column `updated_at` to the `StuednAttendance` table without a default value. This is not possible if the table is not empty.
 - Added the required column `userId` to the `StuednAttendance` table without a default value. This is not possible if the table is not empty.
 - Added the required column `updated_at` to the `Subject` table without a default value. This is not possible if the table is not empty.
 - Added the required column `userId` to the `Subject` table without a default value. This is not possible if the table is not empty.
 - Added the required column `updated_at` to the `Subscriptions` table without a default value. This is not possible if the table is not empty.
 - Added the required column `userId` to the `Subscriptions` table without a default value. This is not possible if the table is not empty.
 - Added the required column `updated_at` to the `Transaction` table without a default value. This is not possible if the table is not empty.
 - Added the required column `userId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
 - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.
 - Added the required column `updated_at` to the `WeeklyReport` table without a default value. This is not possible if the table is not empty.
 
 */
-- AlterTable
ALTER TABLE "Bank"
ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL,
  ADD COLUMN "userId" UUID NOT NULL;
-- AlterTable
ALTER TABLE "Category"
ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL,
  ADD COLUMN "userId" UUID NOT NULL;
-- AlterTable
ALTER TABLE "Class"
ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL,
  ADD COLUMN "userId" UUID NOT NULL;
-- AlterTable
ALTER TABLE "Employee"
ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL,
  ADD COLUMN "userId" UUID NOT NULL;
-- AlterTable
ALTER TABLE "EmployeeAttendance"
ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL,
  ADD COLUMN "userId" UUID NOT NULL;
-- AlterTable
ALTER TABLE "ExpenseType"
ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL,
  ADD COLUMN "userId" UUID NOT NULL;
-- AlterTable
ALTER TABLE "Guardian"
ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL,
  ADD COLUMN "userId" UUID NOT NULL;
-- AlterTable
ALTER TABLE "IncomeType"
ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL,
  ADD COLUMN "userId" UUID NOT NULL;
-- AlterTable
ALTER TABLE "MessageLog"
ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL;
-- AlterTable
ALTER TABLE "Payroll"
ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL,
  ADD COLUMN "userId" UUID NOT NULL;
-- AlterTable
ALTER TABLE "Student"
ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL,
  ADD COLUMN "userId" UUID NOT NULL;
-- AlterTable
ALTER TABLE "StuednAttendance"
ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL,
  ADD COLUMN "userId" UUID NOT NULL;
-- AlterTable
ALTER TABLE "Subject"
ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL,
  ADD COLUMN "userId" UUID NOT NULL;
-- AlterTable
ALTER TABLE "Subscriptions"
ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL,
  ADD COLUMN "userId" UUID NOT NULL;
-- AlterTable
ALTER TABLE "Transaction"
ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL,
  ADD COLUMN "userId" UUID NOT NULL;
-- AlterTable
ALTER TABLE "User"
ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL;
-- AlterTable
ALTER TABLE "WeeklyReport"
ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL;
-- AddForeignKey
ALTER TABLE "Student"
ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Subscriptions"
ADD CONSTRAINT "Subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Guardian"
ADD CONSTRAINT "Guardian_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Class"
ADD CONSTRAINT "Class_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Subject"
ADD CONSTRAINT "Subject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Employee"
ADD CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "EmployeeAttendance"
ADD CONSTRAINT "EmployeeAttendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "StuednAttendance"
ADD CONSTRAINT "StuednAttendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Payroll"
ADD CONSTRAINT "Payroll_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Bank"
ADD CONSTRAINT "Bank_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Category"
ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "IncomeType"
ADD CONSTRAINT "IncomeType_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "ExpenseType"
ADD CONSTRAINT "ExpenseType_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Transaction"
ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;