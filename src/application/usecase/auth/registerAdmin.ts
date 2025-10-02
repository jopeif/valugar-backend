import { User } from "../../../domain/entities/User";
import { UserRepository } from "../../../domain/repositories/User.repository";
import { RegisterAdminInput, RegisterAdminOutput } from "../../dto/auth/RegisterAdminDTO";
import { UseCase } from "../UseCase";

export class RegisterAdminUseCase implements UseCase<RegisterAdminInput, RegisterAdminOutput> {
    constructor(private readonly userRepository: UserRepository) {}

    async execute (input: RegisterAdminInput): Promise<RegisterAdminOutput> {
        try {
            const { email, name, password, phone, creationCode } = input;
            const user = await User.build(email, name, password, 'admin', phone);

            if (creationCode !== process.env.ADMIN_CREATION_CODE) {
                throw new Error('Invalid creation code');
            }

            const existingUser = await this.userRepository.findByEmail(email);
            if (existingUser) {
                throw new Error('Email already in use');
            }
            const id = await this.userRepository.save(user);
            return { id };
        } catch (error) {
            console.error("Erro no RegisterUserUseCase:", error);
            throw error;
        }
        

    }
}