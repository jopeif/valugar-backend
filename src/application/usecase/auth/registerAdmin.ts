import { User } from "../../../domain/entities/User";
import { UserRepository } from "../../../domain/repositories/User.repository";
import { MailProvider } from "../../../infra/web/providers/mailProvider";
import { RegisterAdminInput, RegisterAdminOutput } from "../../dto/auth/RegisterAdminDTO";
import { UseCase } from "../UseCase";
import jwt from "jsonwebtoken";

export class RegisterAdminUseCase implements UseCase<RegisterAdminInput, RegisterAdminOutput> {
    constructor(private readonly userRepository: UserRepository, private readonly mailProvider: MailProvider) {}

    async execute (input: RegisterAdminInput): Promise<RegisterAdminOutput> {
        try {
            const { email, name, password, phone, creationCode } = input;

            const verificationToken = jwt.sign(
                { email },
                process.env.JWT_EMAIL_VERIFICATION_SECRET as string,
                { expiresIn: "1d" }
            );

            const user = await User.build(email, name, password, 'admin', phone, verificationToken);


            
            if (creationCode !== process.env.ADMIN_CREATION_CODE) {
                throw new Error('Invalid creation code');
            }

            const existingUser = await this.userRepository.findByEmail(email);
            if (existingUser) {
                throw new Error('Email already in use');
            }
            const id = await this.userRepository.save(user);
            await this.mailProvider.sendVerificationEmail(email, verificationToken);
            return { id };
        } catch (error) {
            console.error("Erro no RegisterUserUseCase:", error);
            throw error;
        }
        

    }
}