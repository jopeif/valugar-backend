import { ListingRepository } from "../../../domain/repositories/Listing.repository";
import { deleteListingDTOInput, deleteListingDTOOutput } from "../../dto/listing/DeleteListingDTO";
import { UseCase } from "../UseCase";

export class DeleteListingUseCase implements UseCase<deleteListingDTOInput, deleteListingDTOOutput> {
    constructor(private readonly listingRepo:ListingRepository){}

    async execute(input: deleteListingDTOInput): Promise<deleteListingDTOOutput> {
        try {
            const { id } = input;
            const success = await this.listingRepo.delete(id);
            return { success };
        } catch (error) {
            console.error("Erro ao deletar listing:", error);
            throw error;
        }
    }
}
