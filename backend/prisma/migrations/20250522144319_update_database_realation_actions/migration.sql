-- DropForeignKey
ALTER TABLE "Bank" DROP CONSTRAINT "Bank_userId_fkey";
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_userId_fkey";
-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_userId_fkey";
-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_userId_fkey";
-- DropForeignKey
ALTER TABLE "EmployeeAttendance" DROP CONSTRAINT "EmployeeAttendance_userId_fkey";
-- DropForeignKey
ALTER TABLE "ExpenseType" DROP CONSTRAINT "ExpenseType_userId_fkey";
-- DropForeignKey
ALTER TABLE "Guardian" DROP CONSTRAINT "Guardian_userId_fkey";
-- DropForeignKey
ALTER TABLE "IncomeType" DROP CONSTRAINT "IncomeType_userId_fkey";
-- DropForeignKey
ALTER TABLE "MessageLog" DROP CONSTRAINT "MessageLog_senderId_fkey";
-- DropForeignKey
ALTER TABLE "Payroll" DROP CONSTRAINT "Payroll_userId_fkey";
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_userId_fkey";
-- DropForeignKey
ALTER TABLE "StuednAttendance" DROP CONSTRAINT "StuednAttendance_userId_fkey";
-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_userId_fkey";
-- DropForeignKey
ALTER TABLE "Subscriptions" DROP CONSTRAINT "Subscriptions_userId_fkey";
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";
-- DropForeignKey
ALTER TABLE "WeeklyReport" DROP CONSTRAINT "WeeklyReport_createdById_fkey";
-- AlterTable
ALTER TABLE "Bank"
ALTER COLUMN "userId" DROP NOT NULL;
-- AlterTable
ALTER TABLE "Category"
ALTER COLUMN "userId" DROP NOT NULL;
-- AlterTable
ALTER TABLE "Class"
ALTER COLUMN "userId" DROP NOT NULL;
-- AlterTable
ALTER TABLE "Employee"
ALTER COLUMN "userId" DROP NOT NULL;
-- AlterTable
ALTER TABLE "EmployeeAttendance"
ALTER COLUMN "userId" DROP NOT NULL;
-- AlterTable
ALTER TABLE "ExpenseType"
ALTER COLUMN "userId" DROP NOT NULL;
-- AlterTable
ALTER TABLE "Guardian"
ALTER COLUMN "userId" DROP NOT NULL;
-- AlterTable
ALTER TABLE "IncomeType"
ALTER COLUMN "userId" DROP NOT NULL;
-- AlterTable
ALTER TABLE "MessageLog"
ALTER COLUMN "senderId" DROP NOT NULL;
-- AlterTable
ALTER TABLE "Payroll"
ALTER COLUMN "userId" DROP NOT NULL;
-- AlterTable
ALTER TABLE "Student"
ALTER COLUMN "userId" DROP NOT NULL;
-- AlterTable
ALTER TABLE "StuednAttendance"
ALTER COLUMN "userId" DROP NOT NULL;
-- AlterTable
ALTER TABLE "Subject"
ALTER COLUMN "userId" DROP NOT NULL;
-- AlterTable
ALTER TABLE "Subscriptions"
ALTER COLUMN "userId" DROP NOT NULL;
-- AlterTable
ALTER TABLE "Transaction"
ALTER COLUMN "userId" DROP NOT NULL;
-- AlterTable
ALTER TABLE "WeeklyReport"
ADD COLUMN "userId" UUID;
-- AddForeignKey
ALTER TABLE "Student"
ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Subscriptions"
ADD CONSTRAINT "Subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Guardian"
ADD CONSTRAINT "Guardian_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Class"
ADD CONSTRAINT "Class_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Subject"
ADD CONSTRAINT "Subject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "WeeklyReport"
ADD CONSTRAINT "WeeklyReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "MessageLog"
ADD CONSTRAINT "MessageLog_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Employee"
ADD CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "EmployeeAttendance"
ADD CONSTRAINT "EmployeeAttendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "StuednAttendance"
ADD CONSTRAINT "StuednAttendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Payroll"
ADD CONSTRAINT "Payroll_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Bank"
ADD CONSTRAINT "Bank_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Category"
ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "IncomeType"
ADD CONSTRAINT "IncomeType_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "ExpenseType"
ADD CONSTRAINT "ExpenseType_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Transaction"
ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE
SET NULL ON UPDATE CASCADE;