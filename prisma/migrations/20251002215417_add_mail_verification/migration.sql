-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isMailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mailVerificationToken" TEXT;
