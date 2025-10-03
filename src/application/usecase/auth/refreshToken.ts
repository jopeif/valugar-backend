import { Ref } from "react";
import { RefreshTokenDTOInput, RefreshTokenDTOOutput } from "../../dto/auth/RefreshTokenDTO";
import { UseCase } from "../UseCase";
import { RefreshTokenRepository } from "../../../domain/repositories/refreshToken.repository";
import jwt from "jsonwebtoken";
import { UserRepository } from "../../../domain/repositories/User.repository";
import { config } from "../../../infra/config/config";



export class RefreshTokenUseCase implements UseCase<RefreshTokenDTOInput, RefreshTokenDTOOutput> {
    constructor(
        private readonly refreshTokenRepo: RefreshTokenRepository,
        private readonly userRepository: UserRepository
    ) {}

    async execute(input: RefreshTokenDTOInput): Promise<RefreshTokenDTOOutput> {
        try{
            const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "default_secret";
            const {refreshToken} = input;
            jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

            const storedToken = await this.refreshTokenRepo.findByToken(refreshToken);
            if(!storedToken){
                throw new Error("Refresh token inválido");
            }

            const userId = storedToken.userId;
            const user = await this.userRepository.findById(userId);
            if(!user){
                throw new Error("Usuário não encontrado");
            }
            const newAccessToken = jwt.sign(
                { id: user.getProps().id, role: user.getProps().role },
                process.env.ACCESS_TOKEN_SECRET!,
                { expiresIn: "15m" }
            );

            const newRefreshToken = jwt.sign(
                { userId: user.getProps().id },
                process.env.REFRESH_TOKEN_SECRET!,
                { expiresIn: `${config.refreshTokenDurationInDays}d` }
            );

            const expiresAt = new Date(Date.now() + config.refreshTokenDurationInDays * 24 * 60 * 60 * 1000);
            await this.refreshTokenRepo.deleteAllFromUser(user.getProps().id);
            await this.refreshTokenRepo.save(user.getProps().id, newRefreshToken, expiresAt);

            user.updateLastLogin();
            await this.userRepository.updateLastLogin(user.getProps().id, user.getProps().lastLogin!);
            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        }catch(error){
            console.error("Erro no RefreshTokenUseCase:", error);
            throw error;
        }
    }
}