import { LoginUseCase } from "../application/usecase/auth/login";
import { RegisterUserUseCase } from "../application/usecase/auth/registerUser";
import { RefreshTokenRepositoryPrisma } from "../infra/db/concrete.prisma/refreshTokenRepository.prisma";
import { UserRepositoryPrisma } from "../infra/db/concrete.prisma/userRepository.prisma";
import { AuthController } from "../infra/web/controllers/auth.controller";

export class Container{

    public get authController(): AuthController {
        const authRepo = new UserRepositoryPrisma()
        const refreshTokenRepo = new RefreshTokenRepositoryPrisma()
    
        const registerUserUC = new RegisterUserUseCase(authRepo)
        const loginUC = new LoginUseCase(authRepo, refreshTokenRepo)
        
        return new AuthController(registerUserUC, loginUC);
    }
}