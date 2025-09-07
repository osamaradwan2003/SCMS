-- AlterTable
ALTER TABLE "public"."Guardian" ADD COLUMN     "documents" TEXT,
ADD COLUMN     "profile_photo" TEXT;

-- AlterTable
ALTER TABLE "public"."MessageLog" ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false;
