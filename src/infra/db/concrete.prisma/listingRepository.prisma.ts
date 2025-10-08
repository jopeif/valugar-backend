import { Prisma } from "@prisma/client";
import { Address } from "../../../domain/entities/Address";
import { Listing } from "../../../domain/entities/Listing";
import { PropertyDetails } from "../../../domain/entities/PropertyDetail";
import { ListingRepository } from "../../../domain/repositories/Listing.repository";
import { prisma } from "../prisma";

export class ListingRepositoryPrisma implements ListingRepository {
    
    async findByUserId(id: string): Promise<Listing[] | null> {
        try {
            const listings = await prisma.listing.findMany({
                where: {userId:id},
                include: { address: true, propertyDetails: true},
            })

            if (!listings) {
                return null;
            }
            return listings
                .filter(l => l.address && l.propertyDetails)
                .map(l => {
                    const address = Address.build(
                        l.address!.zipCode,
                        l.address!.state,
                        l.address!.city,
                        l.address!.neighborhood,
                        l.address!.street,
                        l.address!.reference
                    );

                    const details = PropertyDetails.build(
                        Number(l.propertyDetails!.area ?? 0),
                        l.propertyDetails!.bedrooms ?? 0,
                        l.propertyDetails!.bathrooms ?? 0
                    );

                    return Listing.build(
                        l.title,
                        l.type,
                        l.category as "RESIDENTIAL" | "COMMERCIAL" | "MIXED_USE",
                        Number(l.basePrice),
                        l.userId,
                        l.description,
                        l.iptu ? Number(l.iptu) : null,
                        address,
                        details
                    );
                });


        } catch (error) {
            throw error
        }
    }

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
                listing.category as "RESIDENTIAL" | "COMMERCIAL" | "MIXED_USE",
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

    async searchListings(
        query?: string,
        minPrice?: number,
        maxPrice?: number,
        minBedrooms?: number,
        maxBedrooms?: number,
        propertyCategory?: "RESIDENTIAL" | "COMMERCIAL" | "MIXED_USE",
        listingType?: "SALE" | "RENT",
        page: number = 1,
        pageSize: number = 10
    ): Promise<Listing[]> {
        try {
            const listings = await prisma.listing.findMany({
                where: {
                    AND: [
                        query
                            ? {
                                OR: [
                                    { title: { contains: query, mode: "insensitive" } },
                                    { description: { contains: query, mode: "insensitive" } },
                                    { address: { street: { contains: query, mode: "insensitive" } } },
                                    { address: { neighborhood: { contains: query, mode: "insensitive" } } },
                                    { address: { city: { contains: query, mode: "insensitive" } } },
                                    { address: { zipCode: { contains: query, mode: "insensitive" } } },
                                    { user: { name: { contains: query, mode: "insensitive" } } },
                                ],
                            }
                            : {},
                        minPrice ? { basePrice: { gte: minPrice } } : {},
                        maxPrice ? { basePrice: { lte: maxPrice } } : {},
                        minBedrooms ? { propertyDetails: { bedrooms: { gte: minBedrooms } } } : {},
                        maxBedrooms ? { propertyDetails: { bedrooms: { lte: maxBedrooms } } } : {},
                        propertyCategory ? { category: propertyCategory } : {},
                        listingType ? { type: listingType } : {},
                    ],
                },
                include: {
                    address: true,
                    propertyDetails: true,
                    user: true,
                },
                skip: (page - 1) * pageSize,
                take: pageSize,
            });

            return listings
                .filter(l => l.address && l.propertyDetails)
                .map(l => {
                    const address = Address.build(
                        l.address!.zipCode,
                        l.address!.state,
                        l.address!.city,
                        l.address!.neighborhood,
                        l.address!.street,
                        l.address!.reference
                    );

                    const details = PropertyDetails.build(
                        Number(l.propertyDetails!.area ?? 0),
                        l.propertyDetails!.bedrooms ?? 0,
                        l.propertyDetails!.bathrooms ?? 0
                    );

                    return Listing.build(
                        l.title,
                        l.type,
                        l.category as "RESIDENTIAL" | "COMMERCIAL" | "MIXED_USE",
                        Number(l.basePrice),
                        l.userId,
                        l.description,
                        l.iptu ? Number(l.iptu) : null,
                        address,
                        details
                    );
                });
        } catch (error) {
            console.error("Erro ao buscar listings no ListingRepositoryPrisma:", error);
            throw error;
        }
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