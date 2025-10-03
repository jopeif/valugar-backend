import { User } from "../../../domain/entities/User";
import { UserRepository } from "../../../domain/repositories/User.repository";
import { RegisterUserInput, RegisterUserOutput } from "../../dto/auth/RegisterUserDTO";
import { UseCase } from "../UseCase";
import jwt from "jsonwebtoken";
import { MailProvider } from "../../../infra/web/providers/MailProvider";

export class RegisterUserUseCase implements UseCase<RegisterUserInput, RegisterUserOutput> {
    constructor(private readonly userRepository: UserRepository, private readonly mailProvider: MailProvider) {}

    async execute (input: RegisterUserInput): Promise<RegisterUserOutput> {
        try {
            const { email, name, password, phone } = input;

            const verificationToken = jwt.sign(
                { email },
                process.env.JWT_EMAIL_VERIFICATION_SECRET as string,
                { expiresIn: "1d" }
            );

            const user = await User.build(email, name, password, 'user', phone, verificationToken);

            

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