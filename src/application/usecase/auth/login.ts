import { RefreshTokenRepository } from "../../../domain/repositories/refreshToken.repository";
import { UserRepository } from "../../../domain/repositories/User.repository";
import { config } from "../../../infra/config/config";
import { LoginInput, LoginOutput } from "../../dto/auth/LoginDTO";
import { UseCase } from "../UseCase";
import jwt from "jsonwebtoken";


export class LoginUseCase implements UseCase<LoginInput, LoginOutput> {
    constructor(private readonly userRepository: UserRepository, private readonly refreshTokenRepository: RefreshTokenRepository) {}

    async execute (input: LoginInput): Promise<LoginOutput> {
        try {
            const { email, password } = input;
            const user = await this.userRepository.findByEmail(email);

            if (!user || user.getProps().isBlocked || !user.checkPassword(password)) {
                throw new Error("Invalid credentials");
            }


            await this.refreshTokenRepository.deleteAllFromUser(user.getProps().id);

            const accessToken = jwt.sign(
                { id: user.getProps().id, role: user.getProps().role },
                process.env.ACCESS_TOKEN_SECRET!,
                { expiresIn: "15m" }
            );

            const refreshToken = jwt.sign(
                { userId: user.getProps().id },
                process.env.REFRESH_TOKEN_SECRET!,
                { expiresIn: `${config.refreshTokenDurationInDays}d` }
            );

            const expiresAt = new Date(Date.now() + config.refreshTokenDurationInDays * 24 * 60 * 60 * 1000);

            await this.refreshTokenRepository.save(user.getProps().id, refreshToken, expiresAt);

            user.updateLastLogin();
            await this.userRepository.updateLastLogin(user.getProps().id, user.getProps().lastLogin!);
            return { accessToken, refreshToken };
        } catch (error) {
            console.error("Erro no LoginUseCase:", error);
            throw error;
        }
    }
}