import { Address } from "../../../domain/entities/Address";
import { Listing } from "../../../domain/entities/Listing";
import { PropertyDetails } from "../../../domain/entities/PropertyDetail";
import { ListingRepository } from "../../../domain/repositories/Listing.repository";
import { prisma } from "../prisma";

export class ListingRepositoryPrisma implements ListingRepository {
    async findById(id: string): Promise<Listing | null> {
        try {
            const listing = await prisma.listing.findUnique({
                where: { id },
                include: { address: true, propertyDetails: true},
            });

            if (!listing || !listing.address || !listing.propertyDetails) {
                return null;
            }

            const address = Address.build(
                listing.address.zipCode,
                listing.address.state,
                listing.address.city,
                listing.address.neighborhood,
                listing.address.street,
                listing.address.reference
            );

            const details = PropertyDetails.build(
                Number(listing.propertyDetails.area ?? 0),
                listing.propertyDetails.bedrooms ?? 0,
                listing.propertyDetails.bathrooms ?? 0
            );

            const listingEntity = Listing.build(
                listing.title,
                listing.type,
                listing.category as "RESIDENCIAL" | "COMMERCIAL" | "MIXED_USE",
                Number(listing.basePrice),
                listing.userId,
                listing.description,
                listing.iptu ? Number(listing.iptu) : null,
                address,
                details
            );

            return listingEntity;
        } catch (error) {
            console.error("Erro ao buscar listing por ID no ListingRepositoryPrisma:", error);
            throw error;
        }
    }

    searchListings(query: string): Promise<Listing[]> {
        throw new Error("Method not implemented.");
    }
    findByZipCode(zipCode: string): Promise<Listing | null> {
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<Listing[]> {
        throw new Error("Method not implemented.");
    }
    async update(listing: Listing): Promise<boolean> {
        try {
            const props = listing.getProps();
            const addressProps = props.address.getProps();
            const detailsProps = props.PropertyDetails.getProps();

            await prisma.$transaction([
            prisma.address.update({
                where: { id: addressProps.id },
                data: {
                zipCode: addressProps.zipCode,
                state: addressProps.state,
                city: addressProps.city,
                neighborhood: addressProps.neighborhood,
                street: addressProps.street,
                reference: addressProps.reference ?? null,
                },
            }),
            prisma.propertyDetail.update({
                where: { id: detailsProps.id },
                data: {
                area: detailsProps.area,
                bedrooms: detailsProps.bedrooms,
                bathrooms: detailsProps.bathrooms,
                },
            }),
            prisma.listing.update({
                where: { id: props.id },
                data: {
                title: props.title,
                description: props.description,
                type: props.type,
                category: props.category,
                basePrice: Number(props.basePrice),
                iptu: props.iptu ? Number(props.iptu) : null,
                userId: props.userId,
                updatedAt: new Date(),
                },
            }),
            ]);

            return true;
        } catch (error) {
            console.error("Erro ao atualizar anúncio no ListingRepositoryPrisma:", error);
            throw error;
        }
        }

    async delete(id: string): Promise<boolean> {
        try {
            await prisma.listing.delete({
                where: { id }
            });
            return true;
        } catch (error) {
            console.log("Erro ao deletar listing no ListingRepositoryPrisma:", error);
            throw error;
        }
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
                        category: listingProps.category as 'RESIDENCIAL' | 'COMMERCIAL' | 'MIXED_USE',
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