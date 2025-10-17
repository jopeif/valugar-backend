import { FindListingByUserUseCase } from './../application/usecase/listing/findListingByUser';
import { DeleteUserUseCase } from "../application/usecase/auth/deleteUser";
import { FindAllUsersUseCase } from "../application/usecase/auth/findAllUsers";
import { FindUserByEmailUseCase } from "../application/usecase/auth/findUserByEmail";
import { FindUserByIdUseCase } from "../application/usecase/auth/findUserById";
import { LoginUseCase } from "../application/usecase/auth/login";
import { RefreshTokenUseCase } from "../application/usecase/auth/refreshToken";
import { RegisterAdminUseCase } from "../application/usecase/auth/registerAdmin";
import { RegisterUserUseCase } from "../application/usecase/auth/registerUser";
import { VerificateEmailUseCase } from "../application/usecase/auth/verificateEmail";
import { CreateListingUseCase } from "../application/usecase/listing/createListing";
import { DeleteListingUseCase } from "../application/usecase/listing/deleteListing";
import { FindListingByIdUseCase } from "../application/usecase/listing/findListingById";
import { SearchListingsUseCase } from "../application/usecase/listing/searchListings";
import { UpdateListingUseCase } from "../application/usecase/listing/updateListing";
import { ListingRepositoryPrisma } from "../infra/db/concrete.prisma/listingRepository.prisma";
import { RefreshTokenRepositoryPrisma } from "../infra/db/concrete.prisma/refreshTokenRepository.prisma";
import { UserRepositoryPrisma } from "../infra/db/concrete.prisma/userRepository.prisma";
import { AuthController } from "../infra/web/controllers/auth.controller";
import { listingController } from "../infra/web/controllers/listing.controller";
import { NodemailerMailProvider } from "../infra/web/providers/email/nodemailerMailProvider";
import { UploadMediaUseCase } from '../application/usecase/media.ts/UploadListingMedia';
import { MediaRepositoryPrisma } from '../infra/db/concrete.prisma/mediaRepository.prisma';
import { FindMediaByListingIdUseCase } from '../application/usecase/media.ts/findMediaByListing';

export class Container{

    public get authController(): AuthController {
        const authRepo = new UserRepositoryPrisma()
        const refreshTokenRepo = new RefreshTokenRepositoryPrisma()
        const mailProvider = new NodemailerMailProvider()
        
        const registerUserUC = new RegisterUserUseCase(authRepo, mailProvider)
        const registerAdminUC = new RegisterAdminUseCase(authRepo, mailProvider)
        const loginUC = new LoginUseCase(authRepo, refreshTokenRepo, mailProvider)
        const refreshTokenUC = new RefreshTokenUseCase(refreshTokenRepo, authRepo)
        const findAllUsersUC = new FindAllUsersUseCase(authRepo)
        const deleteUserUC = new DeleteUserUseCase(authRepo)
        const findUserByIdUC = new FindUserByIdUseCase(authRepo)
        const findUserByEmailUC = new FindUserByEmailUseCase(authRepo)
        const verificateEmailUC = new VerificateEmailUseCase(authRepo)

        return new AuthController(registerUserUC, registerAdminUC, loginUC, findAllUsersUC, deleteUserUC, findUserByIdUC, findUserByEmailUC, refreshTokenUC, verificateEmailUC);
    }

    public get listingController(): listingController {
        const listingRepo = new ListingRepositoryPrisma()
        const authRepo = new UserRepositoryPrisma()
        const mediaRepo = new MediaRepositoryPrisma()

        const createListingUseCase = new CreateListingUseCase(listingRepo)
        const deleteListingUseCase = new DeleteListingUseCase(listingRepo)
        const findByIdUseCase = new FindListingByIdUseCase(listingRepo)
        const updateListingUC = new UpdateListingUseCase(listingRepo)
        const searchListingsUC = new SearchListingsUseCase(listingRepo)
        const findListingByUserUC = new FindListingByUserUseCase(listingRepo, authRepo)
        const uploadMediaUC = new UploadMediaUseCase(mediaRepo, listingRepo)
        const findMediaByListingUC = new FindMediaByListingIdUseCase(mediaRepo, listingRepo)

        return new listingController(createListingUseCase, deleteListingUseCase, findByIdUseCase, updateListingUC, searchListingsUC, findListingByUserUC, uploadMediaUC, findMediaByListingUC);
    }
}