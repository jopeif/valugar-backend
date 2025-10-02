import { UserRepository } from "../../../domain/repositories/User.repository";
import { FindUserByEmailInput, FindUserByEmailOutput } from "../../dto/auth/FindUserByEmailDTO";
import { UseCase } from "../UseCase";

export class FindUserByEmailUseCase implements UseCase<FindUserByEmailInput, FindUserByEmailOutput> {
    constructor(private readonly userRepository: UserRepository) {}

    async execute (input: FindUserByEmailInput): Promise<FindUserByEmailOutput> {
        try {
            const { email } = input;
            const user = await this.userRepository.findByEmail(email);

            if (!user) {
                throw new Error("User not found");
            }
            const props = user.getProps();
            return {
                id: props.id,
                email: props.email,
                name: props.name,
                phone: props.phone,
                role: props.role,
                createdAt: props.createdAt,
                lastLogin: props.lastLogin,
                isBlocked: props.isBlocked,
            };
        } catch (error) {
            console.error("Erro no findUserByEmailUseCase:", error);
            throw error;
        }
    }
}