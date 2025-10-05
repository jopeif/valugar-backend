import { Address } from "../entities/Address";
import { Listing } from "../entities/Listing";
import { PropertyDetails } from "../entities/PropertyDetail";

export interface ListingRepository {
    save(listing:Listing, address: Address, details: PropertyDetails): Promise<string>;
    findById(id: string): Promise<Address | null>;
    searchListings(query: string): Promise<Listing[]>;
    findByZipCode(zipCode: string): Promise<Address | null>;
    findAll(): Promise<Address[]>;
    update(address: Address): Promise<boolean>;
    delete(id: string): Promise<boolean>;
}