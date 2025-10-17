import { MediaRepository } from "../../../../domain/repositories/Media.repository";
import { LocalUploader } from "../../../../infra/utils/LocalUploader";
import { DeleteMediaDTOInput } from "../../../dto/listing/media/DeleteMedia";
import { UseCase } from "../../UseCase";

export class DeleteMediaUseCase implements UseCase <DeleteMediaDTOInput, void> {
    constructor(private readonly mediaRepo: MediaRepository){}
    async execute(input: DeleteMediaDTOInput): Promise<void> {
        try {
            const {id} = input

            const media = await this.mediaRepo.findById(id)

            if(!media){
                throw new Error("Nenhuma mídia encontrada com o dado ID.")
            }

            const url = media.getProps().url!.split("/")[1]
            await LocalUploader.delete(String(`./src/infra/storage/listings/${url}`))

        } catch (error) {
            throw error
        }
    }
    
}