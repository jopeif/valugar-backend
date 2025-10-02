import { UserRepository } from "../../../domain/repositories/User.repository";
import { deleteUserInput, deleteUserOutput } from "../../dto/auth/DeleteUserDTO";
import { UseCase } from "../UseCase";

export class DeleteUserUseCase implements UseCase<deleteUserInput, deleteUserOutput> {
    constructor(private userRepository: UserRepository) {}

    async execute(input: deleteUserInput): Promise<deleteUserOutput> {
        try {
            const { id } = input;
            const user = await this.userRepository.findById(id);
            if (!user) {
                throw new Error("User not found");
            }
            console.log("User found:", user);
            const result = await this.userRepository.delete(id);
            console.log("User deletion result:", result);

            const secondCheck = await this.userRepository.findById(id);
            if (secondCheck) {
                throw new Error("User deletion failed");
            }
            
            return result;
        } catch (error) {
            console.error("Erro no DeleteUserUseCase:", error);
            throw error;
        }
    }
}