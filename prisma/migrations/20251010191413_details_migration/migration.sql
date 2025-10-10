/*
  Warnings:

  - The values [SALE,RENT] on the enum `ListingType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "ContactMethod" AS ENUM ('EMAIL', 'PHONE', 'BOTH');

-- AlterEnum
BEGIN;
CREATE TYPE "ListingType_new" AS ENUM ('CASA', 'APARTAMENTO', 'KITNET', 'QUARTO', 'SITIO', 'OUTRO');
ALTER TABLE "listings" ALTER COLUMN "type" TYPE "ListingType_new" USING ("type"::text::"ListingType_new");
ALTER TYPE "ListingType" RENAME TO "ListingType_old";
ALTER TYPE "ListingType_new" RENAME TO "ListingType";
DROP TYPE "public"."ListingType_old";
COMMIT;

-- AlterTable
ALTER TABLE "property_details" ADD COLUMN     "doesntPayWaterBill" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasBackyard" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasCeilingLining" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasCeramicFlooring" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasGarage" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasPool" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasSolarPanel" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPetFriendly" BOOLEAN NOT NULL DEFAULT false;
