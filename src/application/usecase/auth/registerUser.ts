import { User } from "../../../domain/entities/User";
import { UserRepository } from "../../../domain/repositories/User.repository";
import { RegisterUserInput, RegisterUserOutput } from "../../dto/auth/RegisterUserDTO";
import { UseCase } from "../UseCase";

export class RegisterUserUseCase implements UseCase<RegisterUserInput, RegisterUserOutput> {
    constructor(private readonly userRepository: UserRepository) {}

    async execute (input: RegisterUserInput): Promise<RegisterUserOutput> {
        try {
            const { email, name, password, phone } = input;
            const user = await User.build(email, name, password, 'user', phone);
            const id = await this.userRepository.save(user);
            return { id };
        } catch (error) {
            console.error("Erro no RegisterUserUseCase:", error);
            throw error;
        }
        

    }
}