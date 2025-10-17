-- AlterTable
ALTER TABLE "Media" ALTER COLUMN "description" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ProfilePicture" (
    "id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "ProfilePicture_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfilePicture_userId_key" ON "ProfilePicture"("userId");

-- AddForeignKey
ALTER TABLE "ProfilePicture" ADD CONSTRAINT "ProfilePicture_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
