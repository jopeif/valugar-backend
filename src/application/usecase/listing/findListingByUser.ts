import { ListingRepository } from "../../../domain/repositories/Listing.repository";
import { UserRepository } from "../../../domain/repositories/User.repository";
import { FindListingByUserDTOInput, FindListingByUserDTOOutput } from "../../dto/listing/FindListingByUserDTO";
import { UseCase } from "../UseCase";

export class FindListingByUserUseCase implements UseCase<FindListingByUserDTOInput, FindListingByUserDTOOutput>{
    constructor(private readonly listingRepo:ListingRepository, private readonly userRepo:UserRepository){}
    
    async execute(input: FindListingByUserDTOInput): Promise<FindListingByUserDTOOutput> {
        try {
            const { id } = input

            const user = await this.userRepo.findById(id)

            if(!user){
                throw new Error("Usuário não existente.")
            }

            const listings = await this.listingRepo.findByUserId(id);
            if (!listings) {
                throw new Error("Listing not found");
            }

            return listings.map(listing => {
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
                        reference: address.reference ?? null,
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
            });
        } catch (error) {
            console.error("Erro no usecase", error)
            throw error
        }
    }

    
}