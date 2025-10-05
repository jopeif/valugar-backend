import { Address } from "../../../domain/entities/Address";
import { Listing } from "../../../domain/entities/Listing";
import { PropertyDetails } from "../../../domain/entities/PropertyDetail";
import { ListingRepository } from "../../../domain/repositories/listing.repository";
import { prisma } from "../prisma";

export class ListingRepositoryPrisma implements ListingRepository {
    findById(id: string): Promise<Address | null> {
        throw new Error("Method not implemented.");
    }
    searchListings(query: string): Promise<Listing[]> {
        throw new Error("Method not implemented.");
    }
    findByZipCode(zipCode: string): Promise<Address | null> {
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<Address[]> {
        throw new Error("Method not implemented.");
    }
    update(address: Address): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async save(listing: Listing, address: Address, details: PropertyDetails): Promise<string> {
        try {
            const listingProps = listing.getProps();
            const addressProps = address.getProps();
            const detailsProps = details.getProps();

            

            await prisma.$transaction(async (tx) => {
                
                const detailsRecord = await tx.propertyDetail.create({
                    data: {
                        id: detailsProps.id,
                        area: detailsProps.area,
                        bedrooms: detailsProps.bedrooms,
                        bathrooms: detailsProps.bathrooms
                    }
                });
                
                const addressRecord = await tx.address.create({
                    data: {
                        id: addressProps.id,
                        zipCode: addressProps.zipCode,
                        state: addressProps.state,
                        city: addressProps.city,
                        neighborhood: addressProps.neighborhood,
                        street: addressProps.street,
                        reference: addressProps.reference
                    }
                })

                const listingRecord = await tx.listing.create({
                    data: {
                        id: listingProps.id,
                        title: listingProps.title,
                        description: listingProps.description,
                        type: listingProps.type,
                        category: listingProps.category as 'RESIDENTIAL' | 'COMMERCIAL' | 'MIXED_USE',
                        basePrice: listingProps.basePrice as number,
                        iptu: listingProps.iptu as number,
                        user: {
                            connect: { id: listingProps.userId }
                        },
                        address: {
                            connect: { id: addressProps.id }
                        },
                        propertyDetails: {
                            connect: { id: detailsProps.id }
                        }
                    }
                });
            }
        )
        
        return listingProps.id;
    } catch (error) {
        console.error("Erro ao salvar listing no ListingRepositoryPrisma:", error);
        throw error;
    }
}       
}