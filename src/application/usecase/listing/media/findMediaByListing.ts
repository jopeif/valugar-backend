import { ListingRepository } from "../../../../domain/repositories/Listing.repository";
import { MediaRepository } from "../../../../domain/repositories/Media.repository";
import { FindMediaByListingIddDTOInput, FindMediaByListingIddDTOOutput } from "../../../dto/listing/media/FindMediaByListingIdDTO";
import { UseCase } from "../../UseCase";

export class FindMediaByListingIdUseCase implements UseCase<FindMediaByListingIddDTOInput, FindMediaByListingIddDTOOutput> {

    constructor(
        private readonly mediaRepo: MediaRepository,
        private readonly listingRepo: ListingRepository
    ) {}

    async execute(input: FindMediaByListingIddDTOInput): Promise<FindMediaByListingIddDTOOutput> {
        try {
            const { id } = input;

            const listing = await this.listingRepo.findById(id);

            if (!listing) {
                throw new Error("Anúncio não existe.");
            }

            const mediaList = await this.mediaRepo.findByListingId(id);

            if(!mediaList){
                return null
            }

            const result: FindMediaByListingIddDTOOutput = mediaList.map((m) => {
                const props = m.getProps();
                return {
                    id: props.id,
                    title: props.title,
                    description: props.description ? props.description : "",
                    type: props.type,
                    url: props.url,
                };
            });

            return result;
            
            
            

            

        } catch (error) {
            throw error;
        }
    }

}
