-- DropForeignKey
ALTER TABLE "public"."listings" DROP CONSTRAINT "fk_listing_address";

-- DropForeignKey
ALTER TABLE "public"."listings" DROP CONSTRAINT "fk_listing_details";

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_details_id_fkey" FOREIGN KEY ("details_id") REFERENCES "property_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;
