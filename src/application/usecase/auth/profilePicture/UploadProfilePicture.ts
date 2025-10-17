import { Media } from "../../../../domain/entities/Media";
import { MediaRepository } from "../../../../domain/repositories/Media.repository";
import { UseCase } from "../../UseCase";
import { LocalUploader } from "../../../../infra/utils/LocalUploader";
import { UploadConfig } from "../../../../infra/utils/UploadConfig";
import { UploadProfilePictureDTOInput, UploadProfilePictureDTOOutput } from "../../../dto/auth/profilePicture/UploadProfilePictureDTO";
import { UserRepository } from "../../../../domain/repositories/User.repository";
import { ProfilePicture } from "../../../../domain/entities/ProfilePicture";

export class UploadProfilePictureUseCase implements UseCase<UploadProfilePictureDTOInput, UploadProfilePictureDTOOutput> {
    constructor(private readonly userRepo: UserRepository) {}


async execute(input: UploadProfilePictureDTOInput): Promise<UploadProfilePictureDTOOutput> {
    const { userId, file } = input;


    const user = await this.userRepo.findById(userId);
    if (!user) {
        throw new Error("Usuário não encontrado.")
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
            throw new Error(`Tipo de arquivo não permitido: ${file.mimetype}`);
        }

    if(user.getProps().profilePicture){
        const url = user.getProps().profilePicture?.getProps().url!.split("/")[1]
        LocalUploader.delete(String(`./src/infra/storage/profilePictures/${url}`))
        this.userRepo.deleteProfilePicture(user.getProps().profilePicture?.getProps().id!)
    }


    const config: UploadConfig = {
        allowedTypes: ["image/jpeg", "image/png", "image/webp"],
        maxSizeMB: 100,
        maxFiles: 1,
    };


    const savedPath = await LocalUploader.upload(file, config, `src/infra/storage/profilePictures/`);

    const pp = ProfilePicture.build(`profile-picture/${savedPath}`, userId);
    
    await this.userRepo.saveProfiePicture(pp);



    return { media: savedPath };
}
}