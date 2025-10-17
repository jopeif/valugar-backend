import { ListingRepository } from "../../../domain/repositories/Listing.repository";
import { findListingByIdDTOInput, findListingByIdDTOOutput } from "../../dto/listing/FindListingByIdDTO";
import { UseCase } from "../UseCase";

export class FindListingByIdUseCase implements UseCase<findListingByIdDTOInput, findListingByIdDTOOutput>{
    constructor(private readonly repository: ListingRepository){}

    async execute(input: findListingByIdDTOInput): Promise<findListingByIdDTOOutput> {
        try {
            const { id } = input;
            const listing = await this.repository.findById(id);
            if (!listing) {
                throw new Error("Listing not found");
            }
            return {
                id: listing.getProps().id,
                title: listing.getProps().title,
                description: listing.getProps().description,
                type: listing.getProps().type,
                category: listing.getProps().category,
                basePrice: listing.getProps().basePrice,
                iptu: listing.getProps().iptu,
                userId: listing.getProps().userId,
                createdAt: listing.getProps().createdAt,
                updatedAt: listing.getProps().updatedAt,
                address: {
                    zipCode: listing.getProps().address.getProps().zipCode,
                    state: listing.getProps().address.getProps().state,
                    city: listing.getProps().address.getProps().city,
                    neighborhood: listing.getProps().address.getProps().neighborhood,
                    street: listing.getProps().address.getProps().street,
                    reference: listing.getProps().address.getProps().reference,
                },
                details: {
                    area: listing.getProps().propertyDetails.getProps().area,
                    bedrooms: listing.getProps().propertyDetails.getProps().bedrooms,
                    bathrooms: listing.getProps().propertyDetails.getProps().bathrooms,

                    hasGarage: listing.getProps().propertyDetails.getProps().hasGarage,
                    isPetFriendly: listing.getProps().propertyDetails.getProps().isPetFriendly,
                    hasCeramicFlooring: listing.getProps().propertyDetails.getProps().hasCeilingLining,
                    hasCeilingLining: listing.getProps().propertyDetails.getProps().hasBackyard,
                    hasBackyard: listing.getProps().propertyDetails.getProps().hasBackyard,
                    hasPool: listing.getProps().propertyDetails.getProps().hasPool,
                    hasSolarPanel: listing.getProps().propertyDetails.getProps().hasSolarPanel,
                    hasParkingLot: listing.getProps().propertyDetails.getProps().hasParkingLot,
                    isAccessible: listing.getProps().propertyDetails.getProps().isAccessible,
                    hasAirConditioner: listing.getProps().propertyDetails.getProps().hasAirConditioner,
                    hasChildArea: listing.getProps().propertyDetails.getProps().hasChildArea,
                    hasKitchen: listing.getProps().propertyDetails.getProps().hasKitchen,
                    hasWarehouse: listing.getProps().propertyDetails.getProps().hasWarehouse,
                    
                }
            };

        } catch (error) {
            console.error("Erro ao buscar listing por ID:", error);
            throw error;
        }
    } 
}