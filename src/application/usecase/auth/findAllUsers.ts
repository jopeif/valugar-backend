import { UserRepository } from "../../../domain/repositories/User.repository";
import { FindAllUsersOutput } from "../../dto/auth/FindAllUsersDTO";
import { UseCase } from "../UseCase";

export class FindAllUsersUseCase implements UseCase<void, FindAllUsersOutput> {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(): Promise<FindAllUsersOutput> {
        try {
            const usersRaw = await this.userRepository.findAll();

            const users = usersRaw.map(user => {
                const props = user.getProps();
                const output = {
                    id: props.id,
                    email: props.email,
                    name: props.name,
                    phone: props.phone,
                    role: props.role,
                    createdAt: props.createdAt,
                    lastLogin: props.lastLogin,
                    isBlocked: props.isBlocked,
                    isMailVerified: props.isMailVerified,
                    ...(props.profilePicture && {
                        profilePicture: {
                        id: props.profilePicture.getProps().id,
                        url: props.profilePicture.getProps().url
                        }
                    })
                };
            return output;
            });

            return users;
        } catch (error) {
            console.error("Erro no FindAllUsersUseCase:", error);
            throw error;
        }
    }
}