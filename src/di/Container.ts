import { DeleteUserUseCase } from "../application/usecase/auth/deleteUser";
import { FindAllUsersUseCase } from "../application/usecase/auth/findAllUsers";
import { FindUserByEmailUseCase } from "../application/usecase/auth/findUserByEmail";
import { FindUserByIdUseCase } from "../application/usecase/auth/findUserById";
import { LoginUseCase } from "../application/usecase/auth/login";
import { RegisterAdminUseCase } from "../application/usecase/auth/registerAdmin";
import { RegisterUserUseCase } from "../application/usecase/auth/registerUser";
import { RefreshTokenRepositoryPrisma } from "../infra/db/concrete.prisma/refreshTokenRepository.prisma";
import { UserRepositoryPrisma } from "../infra/db/concrete.prisma/userRepository.prisma";
import { AuthController } from "../infra/web/controllers/auth.controller";

export class Container{

    public get authController(): AuthController {
        const authRepo = new UserRepositoryPrisma()
        const refreshTokenRepo = new RefreshTokenRepositoryPrisma()
    
        const registerUserUC = new RegisterUserUseCase(authRepo)
        const registerAdminUC = new RegisterAdminUseCase(authRepo)
        const loginUC = new LoginUseCase(authRepo, refreshTokenRepo)
        const findAllUsersUC = new FindAllUsersUseCase(authRepo)
        const deleteUserUC = new DeleteUserUseCase(authRepo)
        const findUserByIdUC = new FindUserByIdUseCase(authRepo)
        const findUserByEmailUC = new FindUserByEmailUseCase(authRepo)

        return new AuthController(registerUserUC, registerAdminUC, loginUC, findAllUsersUC, deleteUserUC, findUserByIdUC, findUserByEmailUC);
    }
}