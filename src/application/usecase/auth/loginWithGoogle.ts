import { ProfilePicture } from "../../../domain/entities/ProfilePicture";
import { User } from "../../../domain/entities/User";
import { RefreshTokenRepository } from "../../../domain/repositories/refreshToken.repository";
import { UserRepository } from "../../../domain/repositories/User.repository";
import { config } from "../../../infra/config/config";
import { MailProvider } from "../../../infra/web/providers/email/MailProvider";
import { LoginWithGoogleInput, LoginWithGoogleOutput } from "../../dto/auth/loginWithGoogleDTO";
import { UseCase } from "../UseCase";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";



export class LoginWithGoogleUseCase implements UseCase<LoginWithGoogleInput, LoginWithGoogleOutput> {
    private googleClient: OAuth2Client;

    constructor(
        private readonly userRepository: UserRepository,
        private readonly refreshTokenRepository: RefreshTokenRepository,
        private readonly mailProvider: MailProvider,
    ) {
        this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    async execute(input: LoginWithGoogleInput): Promise<LoginWithGoogleOutput> {
        const { token } = input;

        try {
            if (!process.env.GOOGLE_CLIENT_ID) {
                throw new Error("GOOGLE_CLIENT_ID não configurado");
            }

            const ticket = await this.googleClient.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();

            if (!payload || !payload.email) {
                throw new Error("Invalid Google token");
            }

            
            const email = payload.email;
            const name = payload.name? payload.name : email.split("@")[0];
            const profilePicture = payload.picture

            let user = await this.userRepository.findByEmail(email);

            
            if (!user) {
                const newUser = await User.build(email, name!, `123${email.split("@")[0]}Password!`, "user")
                const newUserId = await this.userRepository.save(newUser);
                user = await this.userRepository.findById(newUserId);
            }

            if (user!.getProps().isBlocked) {
                throw new Error("User is blocked");
            }

            await this.refreshTokenRepository.deleteAllFromUser(user!.getProps().id);

            const accessToken = jwt.sign(
                { id: user!.getProps().id, role: user!.getProps().role },
                process.env.ACCESS_TOKEN_SECRET!,
                { expiresIn: "15m" }
            );

            const refreshToken = jwt.sign(
                { userId: user!.getProps().id },
                process.env.REFRESH_TOKEN_SECRET!,
                {
                expiresIn: `${config.refreshTokenDurationInDays}d`,
                }
            );

            const expiresAt = new Date(
                Date.now() + config.refreshTokenDurationInDays * 24 * 60 * 60 * 1000
            );

            await this.refreshTokenRepository.save(
                user!.getProps().id,
                refreshToken,
                expiresAt
            );


            user!.updateLastLogin();
            await this.userRepository.updateLastLogin(
                user!.getProps().id,
                user!.getProps().lastLogin!
            );
            
            await this.userRepository.verifyEmail(user!.getProps().id)

            if(profilePicture){
                const pflPicInstance = ProfilePicture.build(profilePicture, user!.getProps().id)
                await this.userRepository.saveProfiePicture(pflPicInstance)
            }

            await this.mailProvider.sendLoginNotification(email, new Date());

            return { accessToken, refreshToken };
        } catch (error) {
            console.error("Erro no LoginWithGoogleUseCase:", error);
            throw new Error("Falha na autenticação com Google");
        }
    }
}
