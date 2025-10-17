-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ListingType" ADD VALUE 'LOJA';
ALTER TYPE "ListingType" ADD VALUE 'BOX';
ALTER TYPE "ListingType" ADD VALUE 'ARMAZEM';
ALTER TYPE "ListingType" ADD VALUE 'SALA';
ALTER TYPE "ListingType" ADD VALUE 'PREDIO';

-- AlterTable
ALTER TABLE "property_details" ADD COLUMN     "hasAirConditioner" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasChildArea" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasKitchen" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasParkingLot" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasWarehouse" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isAccessible" BOOLEAN NOT NULL DEFAULT false;
