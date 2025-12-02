import { ListingRepository } from "../../../domain/repositories/Listing.repository";
import { findAllListingsDTOOutput } from "../../dto/listing/FindAllListingDTO";
import { UseCase } from "../UseCase";

export class FindAllListing implements UseCase<void, findAllListingsDTOOutput> {
    constructor(private readonly repository: ListingRepository) {}

    async execute(): Promise<findAllListingsDTOOutput> {
        try {
            const listings = await this.repository.findAll();

            return {
                allListings: listings.map(listing => {
                    const props = listing.getProps();
                    const address = props.address.getProps();
                    const details = props.propertyDetails.getProps();

                    return {
                        id: props.id,
                        title: props.title,
                        description: props.description,
                        type: props.type,
                        category: props.category,
                        basePrice: props.basePrice,
                        iptu: props.iptu,
                        userId: props.userId,
                        createdAt: props.createdAt,
                        updatedAt: props.updatedAt,
                        address: {
                            zipCode: address.zipCode,
                            state: address.state,
                            city: address.city,
                            neighborhood: address.neighborhood,
                            street: address.street,
                            reference: address.reference,
                        },
                        details: {
                            area: details.area,
                            bedrooms: details.bedrooms,
                            bathrooms: details.bathrooms,

                            hasGarage: details.hasGarage,
                            isPetFriendly: details.isPetFriendly,
                            hasCeramicFlooring: details.hasCeramicFlooring,
                            hasCeilingLining: details.hasCeilingLining,
                            hasBackyard: details.hasBackyard,
                            hasPool: details.hasPool,
                            hasSolarPanel: details.hasSolarPanel,
                            hasParkingLot: details.hasParkingLot,
                            isAccessible: details.isAccessible,
                            hasAirConditioner: details.hasAirConditioner,
                            hasChildArea: details.hasChildArea,
                            hasKitchen: details.hasKitchen,
                            hasWarehouse: details.hasWarehouse,
                        }
                    };
                })
            };

        } catch (error) {
            console.error("Erro ao buscar listings:", error);
            throw error;
        }
    }
}