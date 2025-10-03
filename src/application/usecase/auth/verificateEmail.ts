import { UserRepository } from "../../../domain/repositories/User.repository";
import { VerificateEmailDTOInput, VerificateEmailDTOOutput } from "../../dto/auth/VerificateEmailDTO";
import { UseCase } from "../UseCase";
import jwt from "jsonwebtoken";

export class VerificateEmailUseCase implements UseCase<VerificateEmailDTOInput, VerificateEmailDTOOutput>{

    constructor (private readonly userRepository: UserRepository){}
    async execute(input: VerificateEmailDTOInput): Promise<VerificateEmailDTOOutput> {
        const JWT_EMAIL_VERIFICATION_SECRET = process.env.JWT_EMAIL_VERIFICATION_SECRET as string;
        try {
            const { token } = input;
            const payload = jwt.verify(token as string, JWT_EMAIL_VERIFICATION_SECRET);
            if (typeof payload === 'object' && 'email' in payload) {
                const email = payload.email as string;
                const user = await this.userRepository.findByEmail(email);
                if (user && !user.getProps().isMailVerified) {
                    console.log("User found for email verification:", user);
                    return {success: await this.userRepository.verifyEmail(user.getProps().id)}
                }
                }return {success: false};
            } catch (error) {
            console.error("Erro no VerificateEmailUseCase:", error);
            throw error;
        }        
    }
}