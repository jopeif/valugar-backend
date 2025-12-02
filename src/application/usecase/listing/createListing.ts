import { Address } from "../../../domain/entities/Address";
import { Listing } from "../../../domain/entities/Listing";
import { PropertyDetails } from "../../../domain/entities/PropertyDetail";
import { ListingRepository } from "../../../domain/repositories/Listing.repository";
import { UserRepository } from "../../../domain/repositories/User.repository";
import { createListingDTOInput, createListingDTOOutput } from "../../dto/listing/CreateListingDTO";
import { UseCase } from "../UseCase";

export class CreateListingUseCase implements UseCase<createListingDTOInput, createListingDTOOutput> {

    constructor(
        private readonly repository:ListingRepository,
        private readonly userRepository: UserRepository
    ){}

    async execute(input: createListingDTOInput): Promise<createListingDTOOutput> {
        try {
            const { title, description, type, category, basePrice, iptu, userId, address, details } = input;

            const user =  await this.userRepository.findById(userId);
            if(!user){
                throw new Error("Usuário não encontrado");
            }
            
            if(category=="COMMERCIAL" && ["CASA", "APARTAMENTO", "KITNET", "QUARTO", "SITIO"].includes(type)
            || category=="RESIDENTIAL" && ["LOJA", "BOX", "ARMAZEM", "SALA", "PREDIO"].includes(type)
            ){ 
                throw new Error("Tipo do imóvel não condiz com a categoria")
            }

            const detailsInstance = PropertyDetails.build(
                details.area,
                details.bedrooms,
                details.bathrooms,

                details.doesntPayWaterBill,
                details.hasGarage,
                details.isPetFriendly,
                details.hasCeramicFlooring,
                details.hasCeilingLining,
                details.hasBackyard,
                details.hasPool,
                details.hasSolarPanel,

                details.hasParkingLot,
                details.isAccessible,
                details.hasAirConditioner,
                details.hasChildArea,
                details.hasKitchen,
                details.hasWarehouse,
            );

            console.log("Details instance created:", detailsInstance);


            const addressInstance = Address.build(
                address.zipCode,
                address.state,
                address.city,
                address.neighborhood,
                address.street,
                address.reference || null
            );

            const listingInstance = Listing.build(
                title,
                type,
                category,
                basePrice,
                userId,
                description || null,
                iptu || null,
                addressInstance,
                detailsInstance,
            );

            const listingId = await this.repository.save(listingInstance, addressInstance, detailsInstance);
            return { id: listingId };

        } catch (error) {
            console.error("Erro ao criar listing:", error);
            throw error;
        }
    }
}