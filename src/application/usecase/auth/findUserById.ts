import { UserRepository } from "../../../domain/repositories/User.repository";
import { FindUserByIdInput, FindUserByIdOutput } from "../../dto/auth/FindUserByIdDTO";
import { UseCase } from "../UseCase";

export class FindUserByIdUseCase implements UseCase<FindUserByIdInput, FindUserByIdOutput> {
    constructor(private readonly userRepository: UserRepository) {}

    async execute (input: FindUserByIdInput): Promise<FindUserByIdOutput> {
        try {
            const { id } = input;
            const user = await this.userRepository.findById(id);

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
            console.error("Erro no findUserByIdUseCase:", error);
            throw error;
        }
    }
}