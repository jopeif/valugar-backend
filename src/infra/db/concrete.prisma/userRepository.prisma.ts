import { prisma } from "../prisma";
import { User } from "../../../domain/entities/User";
import { UserRepository } from "../../../domain/repositories/User.repository";

export class UserRepositoryPrisma implements UserRepository{
    async save(user: User): Promise<string> {
        try {
            const props = user.getProps();
            await prisma.usuarios.create({
                data: {
                    id: props.id,
                    email: props.email,
                    name: props.name,
                    password: props.password,
                    role: props.role,
                    phone: props.phone ?? null,
                    isblocked: props.isBlocked,
                    createdat: props.createdAt,
                    lastlogin: props.lastLogin ?? null
                }
            });
            return props.id;
        } catch (error) {
            console.error("Erro ao salvar usuário no UserRepositoryPrisma:", error);
            throw error;
        }
    }

    async findById(id: string): Promise<User | null> {
        try {
            const user = await prisma.usuarios.findUnique({
                where: { id }
            });
            if (!user) {
                return null;
            }
            return User.assemble({
                id: user.id,
                email: user.email,
                name: user.name,
                password: user.password,
                role: user.role,
                phone: user.phone ?? undefined,
                isBlocked: user.isblocked,
                createdAt: user.createdat ?? new Date(),
                lastLogin: user.lastlogin ?? new Date()
        });
        } catch (error) {
            console.error("Erro ao buscar usuário por ID no UserRepositoryPrisma:", error);
            throw error;
        }
    }
    findByEmail(email: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<User[]> {
        throw new Error("Method not implemented.");
    }
    updateLastLogin(id: string, date: Date): Promise<void> {
        throw new Error("Method not implemented.");
    }
    update(user: User): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    
}