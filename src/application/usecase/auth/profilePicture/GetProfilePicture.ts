import { GetProfilePictureDTOInput, GetProfilePictureDTOOutput } from "../../../dto/auth/profilePicture/GetProfilePictureDTO";
import { UseCase } from "../../UseCase";

export class GetProfilePictureUseCase implements UseCase <GetProfilePictureDTOInput, GetProfilePictureDTOOutput>{
    execute(input: GetProfilePictureDTOInput): Promise<GetProfilePictureDTOOutput> {
        throw new Error("Method not implemented.");
    }

}