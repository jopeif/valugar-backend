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
      const listingVerifier = await this.listingRepo.findById(input.id);
      if (!listingVerifier) {
        throw new Error("Imóvel não existe.");
      }

      const {
        id,
        title,
        description,
        type,
        category,
        basePrice,
        iptu,
        userId,
        createdAt,
        address,
        propertyDetails,
      } = listingVerifier.getProps();

      const {
        id: addressId,
        zipCode,
        state,
        city,
        neighborhood,
        street,
        reference,
      } = address.getProps();

      const {
        id: detailsId,
        area,
        bedrooms,
        bathrooms,
        doesntPayWaterBill,
        hasGarage,
        isPetFriendly,
        hasCeramicFlooring,
        hasCeilingLining,
        hasBackyard,
        hasPool,
        hasSolarPanel,
      } = propertyDetails.getProps();

      const mergedAddress = Address.assemble({
        id: addressId,
        zipCode: input.address?.zipCode ?? zipCode,
        state: input.address?.state ?? state,
        city: input.address?.city ?? city,
        neighborhood: input.address?.neighborhood ?? neighborhood,
        street: input.address?.street ?? street,
        reference: input.address?.reference ?? reference,
      });

      const mergedDetails = PropertyDetails.assemble({
        id: detailsId,
        area: input.details?.area ?? area,
        bedrooms: input.details?.bedrooms ?? bedrooms,
        bathrooms: input.details?.bathrooms ?? bathrooms,
        doesntPayWaterBill: input.details?.doesntPayWaterBill ?? doesntPayWaterBill,
        hasGarage: input.details?.hasGarage ?? hasGarage,
        isPetFriendly: input.details?.isPetFriendly ?? isPetFriendly,
        hasCeramicFlooring: input.details?.hasCeramicFlooring ?? hasCeramicFlooring,
        hasCeilingLining: input.details?.hasCeilingLining ?? hasCeilingLining,
        hasBackyard: input.details?.hasBackyard ?? hasBackyard,
        hasPool: input.details?.hasPool ?? hasPool,
        hasSolarPanel: input.details?.hasSolarPanel ?? hasSolarPanel,
      });

      const mergedListing = Listing.assemble({
        id,
        title: input.title ?? title,
        description: input.description ?? description,
        type: input.type ?? type,
        category: input.category ?? category,
        basePrice: input.basePrice ?? basePrice,
        iptu: input.iptu ?? iptu,
        userId,
        createdAt,
        updatedAt: new Date(),
        address: mergedAddress,
        propertyDetails: mergedDetails,
      });

      console.log(mergedListing.getProps().address.getProps().id)

      await this.listingRepo.update(mergedListing);

      return { success: true };
    } catch (error) {
      console.error("Erro no useCase de update:", error);
      throw error;
    }
  }
}
