import { Address } from "../../../domain/entities/Address";
import { Listing } from "../../../domain/entities/Listing";
import { PropertyDetails } from "../../../domain/entities/PropertyDetail";
import { ListingRepository } from "../../../domain/repositories/Listing.repository";
import { UpdateListingDTOInput, UpdateListingDTOOutput } from "../../dto/listing/UpdateListingDTO";
import { UseCase } from "../UseCase";

export class UpdateListingUseCase implements UseCase<UpdateListingDTOInput, UpdateListingDTOOutput> {

  constructor(private readonly listingRepo: ListingRepository) {}

  async execute(input: UpdateListingDTOInput): Promise<UpdateListingDTOOutput> {
    try {
      // Reconstroi as entidades a partir do DTO
      const address = Address.assemble({
        id: "addressId",
        zipCode: input.address.zipCode,
        state: input.address.state,
        city: input.address.city,
        neighborhood: input.address.neighborhood,
        street: input.address.street,
        reference: input.address.reference ?? null,
      });

      const propertyDetails = PropertyDetails.assemble({
        id: input.id, 
        area: input.details.area,
        bedrooms: input.details.bedrooms,
        bathrooms: input.details.bathrooms,
      });

      const listing = Listing.assemble({
        id: input.id,
        title: input.title,
        description: input.description,
        type: input.type,
        category: input.category,
        basePrice: input.basePrice,
        iptu: input.iptu,
        userId: input.userId,
        createdAt: input.createdAt,
        updatedAt: new Date(),
        address,
        PropertyDetails: propertyDetails,
      });

      await this.listingRepo.update(listing);

      return { success: true };
    } catch (error) {
      console.error("Erro no useCase de update:", error);
      throw error;
    }
  }
}
