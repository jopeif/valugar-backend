import { Media } from "../../../../domain/entities/Media";
import { MediaRepository } from "../../../../domain/repositories/Media.repository";
import { UseCase } from "../../UseCase";
import { UploadMediaDTOInput, UploadMediaDTOOutput } from "../../../dto/listing/media/UploadMediaDTO";
import { ListingRepository } from "../../../../domain/repositories/Listing.repository";
import { LocalUploader } from "../../../../infra/utils/LocalUploader";
import { UploadConfig } from "../../../../infra/utils/UploadConfig";

export class UploadMediaUseCase implements UseCase<UploadMediaDTOInput, UploadMediaDTOOutput> {
    constructor(private readonly mediaRepo: MediaRepository, private readonly listingRepo: ListingRepository) {}

    // Em UploadMediaUseCase.ts
async execute(input: UploadMediaDTOInput): Promise<UploadMediaDTOOutput> {
    const { title, description, listingId, files } = input;


    const listing = await this.listingRepo.findById(listingId);
    if (!listing) throw new Error("Anúncio não encontrado.");

    const config: UploadConfig = {
        allowedTypes: ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"],
        maxSizeMB: 50,
        maxFiles: 10,
    };

    const savePromises = files.map(async (file) => {
        const savedPath = await LocalUploader.upload(file, config, `src/infra/storage/listings/`);
        
        const mediaType = file.mimetype.startsWith("image/") ? "IMAGE" : "VIDEO";

        const media = Media.build(title, description, mediaType, savedPath, listingId);
        
        return this.mediaRepo.save(media);
    });

    const savedMedias = await Promise.all(savePromises);

    return { medias: savedMedias };
}
}