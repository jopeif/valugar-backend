import { Media } from "../../../domain/entities/Media";
import { MediaRepository } from "../../../domain/repositories/Media.repository";
import { MediaType } from "../../../generated/prisma";
import path from "path";
import { UseCase } from "../UseCase";
import { UploadMediaDTOInput, UploadMediaDTOOutput } from "../../dto/media/UploadMediaDTO";
import { ListingRepository } from "../../../domain/repositories/Listing.repository";


export class UploadMediaUseCase implements UseCase<UploadMediaDTOInput, UploadMediaDTOOutput>{
    constructor(private readonly mediaRepo:MediaRepository, private readonly listingRepo: ListingRepository){}
    
    async execute(input: UploadMediaDTOInput):Promise<UploadMediaDTOOutput> {
        const {title, description, listingId, files} = input
        if (!listingId) throw new Error("ID do imóvel é obrigatório.");
        if (!files || files.length === 0) throw new Error("Nenhum arquivo enviado.");

        const listing = await this.listingRepo.findById(listingId)
        if(!listing){
            throw new Error("Anúncio de imóvel não existe.")
        }
        const mediaRecords = await Promise.all(
        files.map(async (file) => {
            const mime = file.mimetype;
            const type: MediaType = mime.startsWith("video") ? "VIDEO" : "IMAGE";

            
            const url = `/uploads/${path.basename(file.filename)}`;

            const media = Media.build(title, description, type, url, listingId)
            return await this.mediaRepo.save(media)
        })
        );

        return {medias:mediaRecords};
    }
}
