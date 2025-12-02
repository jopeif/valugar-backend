import { Prisma } from "../../../generated/prisma";
import { Address } from "../../../domain/entities/Address";
import { Listing } from "../../../domain/entities/Listing";
import { PropertyDetails } from "../../../domain/entities/PropertyDetail";
import { ListingRepository } from "../../../domain/repositories/Listing.repository";
import { prisma } from "../prisma";

export class ListingRepositoryPrisma implements ListingRepository {
    
    findByZipCode(zipCode: string): Promise<Listing | null> {
        throw new Error("Method not implemented.");
    }
    
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
                    const address = Address.assemble({
                        id: l.address!.id,
                        zipCode: l.address!.zipCode,
                        state: l.address!.state,
                        city: l.address!.city,
                        neighborhood: l.address!.neighborhood,
                        street: l.address!.street,
                        reference: l.address!.reference
                    });

                    const details = PropertyDetails.assemble({
                        id: l.propertyDetails?.id!,
                        area: Number(l.propertyDetails!.area ?? 0),
                        bedrooms: l.propertyDetails!.bedrooms ?? 0,
                        bathrooms: l.propertyDetails!.bathrooms ?? 0,
                        doesntPayWaterBill: l.propertyDetails!.doesntPayWaterBill,
                        hasGarage:l.propertyDetails!.hasGarage,
                        isPetFriendly:l.propertyDetails!.isPetFriendly,
                        hasCeramicFlooring:l.propertyDetails!.hasCeramicFlooring,
                        hasCeilingLining:l.propertyDetails!.hasCeilingLining,
                        hasBackyard:l.propertyDetails!.hasBackyard,
                        hasPool:l.propertyDetails!.hasPool,
                        hasSolarPanel:l.propertyDetails!.hasSolarPanel,
                        hasParkingLot:l.propertyDetails!.hasParkingLot,
                        isAccessible: l.propertyDetails!.isAccessible,
                        hasAirConditioner: l.propertyDetails!.hasAirConditioner,
                        hasChildArea: l.propertyDetails!.hasChildArea,
                        hasKitchen: l.propertyDetails!.hasKitchen,
                        hasWarehouse: l.propertyDetails!.hasWarehouse,
                    });

                    return Listing.assemble({
                        id: l.id,
                        title:l.title,
                        type:l.type,
                        category: l.category as "RESIDENTIAL" | "COMMERCIAL" | "MIXED_USE",
                        basePrice: Number(l.basePrice),
                        userId: l.userId,
                        description: l.description,
                        iptu: l.iptu ? Number(l.iptu) : null,
                        address,
                        propertyDetails: details,
                        createdAt: l.createdAt!,
                        updatedAt: l.updatedAt

                    });
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

            const address = Address.assemble(
                {
                id: listing.address.id,
                zipCode: listing.address.zipCode,
                state: listing.address.state,
                city: listing.address.city,
                neighborhood: listing.address.neighborhood,
                street: listing.address.street,
                reference: listing.address.reference
                }
            );

            const details = PropertyDetails.assemble(
                {
                    id: listing.propertyDetails.id,
                    area:Number(listing.propertyDetails.area ?? 0),
                    bedrooms: listing.propertyDetails.bedrooms ?? 0,
                    bathrooms: listing.propertyDetails.bathrooms ?? 0,
                    doesntPayWaterBill: listing.propertyDetails.doesntPayWaterBill,
                    hasGarage: listing.propertyDetails.hasGarage,
                    isPetFriendly: listing.propertyDetails.isPetFriendly,
                    hasCeramicFlooring:listing.propertyDetails.hasCeramicFlooring,
                    hasCeilingLining: listing.propertyDetails.hasCeilingLining,
                    hasBackyard: listing.propertyDetails.hasBackyard,
                    hasPool: listing.propertyDetails.hasPool,
                    hasSolarPanel: listing.propertyDetails.hasSolarPanel,

                    hasParkingLot: listing.propertyDetails.hasParkingLot,
                    isAccessible: listing.propertyDetails.isAccessible,
                    hasAirConditioner: listing.propertyDetails.hasAirConditioner,
                    hasChildArea: listing.propertyDetails.hasChildArea,
                    hasKitchen: listing.propertyDetails.hasKitchen,
                    hasWarehouse: listing.propertyDetails.hasWarehouse
                }
            );

            const listingEntity = Listing.assemble(
                {
                    id: listing.id,
                    title:listing.title,
                    type: listing.type,
                    category: listing.category as "RESIDENTIAL" | "COMMERCIAL" | "MIXED_USE",
                    basePrice: Number(listing.basePrice),
                    userId: listing.userId,
                    description: listing.description,
                    iptu: listing.iptu ? Number(listing.iptu) : null,
                    address: address,
                    propertyDetails: details,
                    createdAt: listing.createdAt!,
                    updatedAt: listing.updatedAt ?? new Date()

                }
            );

            return listingEntity;
        } catch (error) {
            console.error("Erro ao buscar listing por ID no ListingRepositoryPrisma:", error);
            throw error;
        }
    }

    async searchListings(
    page: number = 1,
    pageSize: number = 10,
    query?: string,
    minPrice?: number,
    maxPrice?: number,
    minBedrooms?: number,
    maxBedrooms?: number,
    propertyCategory?: "RESIDENTIAL" | "COMMERCIAL" | "MIXED_USE",
    type?: "CASA" | "APARTAMENTO" | "KITNET" | "QUARTO" | "SITIO" | "LOJA" | "BOX" | "ARMAZEM" | "SALA" | "PREDIO" | "OUTRO",
    details?: {
        hasGarage?: boolean;
        isPetFriendly?: boolean;
        hasCeramicFlooring?: boolean;
        hasCeilingLining?: boolean;
        hasBackyard?: boolean;
        hasPool?: boolean;
        hasSolarPanel?: boolean;
        hasParkingLot?: boolean,
        isAccessible?: boolean,
        hasAirConditioner?: boolean,
        hasChildArea?: boolean,
        hasKitchen?: boolean,
        hasWarehouse?: boolean,
    },
    ): Promise<{ listings: Listing[]; totalPages: number }> {
        try {
            const where: Prisma.ListingWhereInput = {
                AND: [
                    query
                        ? {
                            OR: [
                                { title: { contains: query, mode: "insensitive" } },
                                { description: { contains: query, mode: "insensitive" } },
                                { address: { city: { contains: query, mode: "insensitive" } } },
                                { address: { neighborhood: { contains: query, mode: "insensitive" } } },
                            ],
                        }
                        : undefined,

                    minPrice != null || maxPrice != null
                        ? {
                            basePrice: {
                                ...(minPrice != null ? { gte: minPrice } : {}),
                                ...(maxPrice != null ? { lte: maxPrice } : {}),
                            },
                        }
                        : undefined,

                    propertyCategory ? { category: propertyCategory } : undefined,
                    type ? { type } : undefined,

                    minBedrooms != null || maxBedrooms != null
                        ? {
                            propertyDetails: {
                                bedrooms: {
                                    ...(minBedrooms != null ? { gte: minBedrooms } : {}),
                                    ...(maxBedrooms != null ? { lte: maxBedrooms } : {}),
                                },
                            },
                        }
                        : undefined,

                    details
                        ? {
                            propertyDetails: Object.fromEntries(
                                Object.entries(details).filter(([_, v]) => v === true)
                            ),
                        }
                        : undefined,
                ].filter(Boolean) as Prisma.ListingWhereInput[],
            };

            const [totalCount, listingsRaw] = await Promise.all([
                prisma.listing.count({ where }),
                prisma.listing.findMany({
                    where,
                    include: { address: true, propertyDetails: true },
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                    orderBy: { createdAt: "desc" },
                }),
            ]);

            const totalPages = Math.ceil(totalCount / pageSize);

            const listings = listingsRaw
                .filter(l => l.address && l.propertyDetails)
                .map(l => {
                    const address = Address.assemble({
                        id: l.address!.id,
                        zipCode: l.address!.zipCode,
                        state: l.address!.state,
                        city: l.address!.city,
                        neighborhood: l.address!.neighborhood,
                        street: l.address!.street,
                        reference: l.address!.reference,
                    });

                    const props = l.propertyDetails!;
                    const details = PropertyDetails.assemble({
                        id: props.id,
                        area: Number(props.area ?? 0),
                        bedrooms: props.bedrooms ?? 0,
                        bathrooms: props.bathrooms ?? 0,
                        doesntPayWaterBill: props.doesntPayWaterBill,
                        hasGarage: props.hasGarage,
                        isPetFriendly: props.isPetFriendly,
                        hasCeramicFlooring: props.hasCeramicFlooring,
                        hasCeilingLining: props.hasCeilingLining,
                        hasBackyard: props.hasBackyard,
                        hasPool: props.hasPool,
                        hasSolarPanel: props.hasSolarPanel,
                        hasParkingLot: props.hasParkingLot,
                        isAccessible: props.isAccessible,
                        hasAirConditioner: props.hasAirConditioner,
                        hasChildArea: props.hasChildArea,
                        hasKitchen: props.hasKitchen,
                        hasWarehouse: props.hasWarehouse,
                    });

                    return Listing.assemble({
                        id: l.id,
                        title: l.title,
                        type: l.type,
                        category: l.category as "RESIDENTIAL" | "COMMERCIAL" | "MIXED_USE",
                        basePrice: Number(l.basePrice),
                        userId: l.userId,
                        description: l.description,
                        iptu: l.iptu ? Number(l.iptu) : null,
                        address,
                        propertyDetails: details,
                        createdAt: l.createdAt!,
                        updatedAt: l.updatedAt,
                    });
                });

            return { listings, totalPages };

        } catch (error) {
            console.error("Erro ao buscar listings no ListingRepositoryPrisma:", error);
            throw error;
        }
    }

        



        async findAll(): Promise<Listing[]> {
            try {
                const listings = await prisma.listing.findMany({
                    include: { address: true, propertyDetails: true },
                    orderBy: { createdAt: "desc" }
                });

                return listings
                    .filter(l => l.address && l.propertyDetails)
                    .map(l => {
                        const address = Address.assemble({
                            id: l.address!.id,
                            zipCode: l.address!.zipCode,
                            state: l.address!.state,
                            city: l.address!.city,
                            neighborhood: l.address!.neighborhood,
                            street: l.address!.street,
                            reference: l.address!.reference
                        });

                        const d = l.propertyDetails!;
                        const details = PropertyDetails.assemble({
                            id: d.id,
                            area: Number(d.area ?? 0),
                            bedrooms: d.bedrooms ?? 0,
                            bathrooms: d.bathrooms ?? 0,
                            doesntPayWaterBill: d.doesntPayWaterBill,
                            hasGarage: d.hasGarage,
                            isPetFriendly: d.isPetFriendly,
                            hasCeramicFlooring: d.hasCeramicFlooring,
                            hasCeilingLining: d.hasCeilingLining,
                            hasBackyard: d.hasBackyard,
                            hasPool: d.hasPool,
                            hasSolarPanel: d.hasSolarPanel,
                            hasParkingLot: d.hasParkingLot,
                            isAccessible: d.isAccessible,
                            hasAirConditioner: d.hasAirConditioner,
                            hasChildArea: d.hasChildArea,
                            hasKitchen: d.hasKitchen,
                            hasWarehouse: d.hasWarehouse
                        });

                        return Listing.assemble({
                            id: l.id,
                            title: l.title,
                            type: l.type,
                            category: l.category as "RESIDENTIAL" | "COMMERCIAL" | "MIXED_USE",
                            basePrice: Number(l.basePrice),
                            userId: l.userId,
                            description: l.description,
                            iptu: l.iptu ? Number(l.iptu) : null,
                            address,
                            propertyDetails: details,
                            createdAt: l.createdAt!,
                            updatedAt: l.updatedAt
                        });
                    });
            } catch (error) {
                console.error("Erro ao listar listings no findAll:", error);
                throw error;
            }
        }


        async update(listing: Listing): Promise<boolean> {
            try {
                const props = listing.getProps();
                const addressProps = props.address.getProps();
                const detailsProps = props.propertyDetails.getProps();

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
                    doesntPayWaterBill: detailsProps.doesntPayWaterBill,
                    hasGarage: detailsProps.hasGarage,
                    isPetFriendly: detailsProps.isPetFriendly,
                    hasCeramicFlooring: detailsProps.hasCeramicFlooring,
                    hasCeilingLining: detailsProps.hasCeilingLining,
                    hasBackyard: detailsProps.hasBackyard,
                    hasPool: detailsProps.hasPool,
                    hasSolarPanel: detailsProps.hasSolarPanel,
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
                    where:{id}
                })
                return true;
                }catch (error) {
                console.log("Erro ao deletar listing no ListingRepositoryPrisma:", error);
                throw error;
            }
        }

        async save(listing: Listing, address: Address, details: PropertyDetails): Promise<string> {
            try {
                const listingProps = listing.getProps();
                const addressProps = address.getProps();
                const detailsProps = details.getProps();

                const result = await prisma.$transaction(async (tx) => {

                    await tx.propertyDetail.create({
                        data: {
                            id: detailsProps.id,
                            area: detailsProps.area,
                            bedrooms: detailsProps.bedrooms,
                            bathrooms: detailsProps.bathrooms,

                            doesntPayWaterBill: detailsProps.doesntPayWaterBill,
                            hasGarage: detailsProps.hasGarage,
                            isPetFriendly: detailsProps.isPetFriendly,
                            hasCeramicFlooring: detailsProps.hasCeramicFlooring,
                            hasCeilingLining: detailsProps.hasCeilingLining,
                            hasBackyard: detailsProps.hasBackyard,
                            hasPool: detailsProps.hasPool,
                            hasSolarPanel: detailsProps.hasSolarPanel,

                            hasParkingLot: detailsProps.hasParkingLot,
                            isAccessible: detailsProps.isAccessible,
                            hasAirConditioner: detailsProps.hasAirConditioner,
                            hasChildArea: detailsProps.hasChildArea,
                            hasKitchen: detailsProps.hasKitchen,
                            hasWarehouse: detailsProps.hasWarehouse,
                        }
                    });


                    await tx.address.create({
                        data: {
                            id: addressProps.id,
                            zipCode: addressProps.zipCode,
                            state: addressProps.state,
                            city: addressProps.city,
                            neighborhood: addressProps.neighborhood,
                            street: addressProps.street,
                            reference: addressProps.reference
                        }
                    });

                    const listingRecord = await tx.listing.create({
                        data: {
                            id: listingProps.id,
                            title: listingProps.title,
                            description: listingProps.description,
                            type: listingProps.type,
                            category: listingProps.category,
                            basePrice: listingProps.basePrice,
                            iptu: listingProps.iptu,
                            createdAt: listingProps.createdAt,
                            updatedAt: listingProps.updatedAt,
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

                    return listingRecord.id;
                });

                return result; // retorno correto

            } catch (error) {
                console.error("Erro ao salvar listing:", error);
                throw error; // deixa o controller retornar 500
            }
        }

}