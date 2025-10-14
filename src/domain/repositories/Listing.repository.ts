import { Address } from "../entities/Address";
import { Listing } from "../entities/Listing";
import { PropertyDetails } from "../entities/PropertyDetail";

export interface ListingRepository {
    save(listing:Listing, address: Address, details: PropertyDetails): Promise<string>;
    findById(id: string): Promise<Listing | null>;
    searchListings(
        page: number,
        pageSize: number,
        query?: string,
        minPrice?: number,
        maxPrice?: number,
        minBedrooms?: number,
        maxBedrooms?: number,
        propertyCategory?: "RESIDENTIAL" | "COMMERCIAL" | "MIXED_USE",
        listingType?: "CASA" | "APARTAMENTO" | "KITNET" | "QUARTO" | "SITIO" | "OUTRO",
        details?: {
            hasGarage?: boolean;
            isPetFriendly?: boolean;
            hasCeramicFlooring?: boolean;
            hasCeilingLining?: boolean;
            hasBackyard?: boolean;
            hasPool?: boolean;
            hasSolarPanel?: boolean;
        },
    ): Promise<{ listings: Listing[]; totalPages: number }> 
    findByUserId(id: string): Promise<Listing[]|null>
    findByZipCode(zipCode: string): Promise<Listing | null>;
    findAll(): Promise<Listing[]>;
    update(address: Listing): Promise<boolean>;
    delete(id: string): Promise<boolean>;
}