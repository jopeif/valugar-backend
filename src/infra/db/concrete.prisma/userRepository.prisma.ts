import { prisma } from "../prisma";
import { User } from "../../../domain/entities/User";
import { UserRepository } from "../../../domain/repositories/User.repository";

export class UserRepositoryPrisma implements UserRepository{
    
    async save(user: User): Promise<string> {
        try {
            const props = user.getProps();
            await prisma.user.create({
                data: {
                    id: props.id,
                    email: props.email,
                    name: props.name,
                    password: props.password,
                    role: props.role,
                    phone: props.phone ?? null,
                    isBlocked: props.isBlocked,
                    createdAt: props.createdAt,
                    lastLogin: props.lastLogin ?? null
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
            const user = await prisma.user.findUnique({
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
                role: user.role as 'admin' | 'user',
                phone: user.phone ?? undefined,
                isBlocked: user.isBlocked,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin ?? undefined
        });
        } catch (error) {
            console.error("Erro ao buscar usuário por ID no UserRepositoryPrisma:", error);
            throw error;
        }
    }
    async findByEmail(email: string): Promise<User | null> {
        try {
            const user = await prisma.user.findUnique({
                where: { email }
            });
            if (!user) {
                return null;
            }
            return User.assemble({
                id: user.id,
                email: user.email,
                name: user.name,
                password: user.password,
                role: user.role  as 'admin' | 'user',
                phone: user.phone ?? undefined,
                isBlocked: user.isBlocked,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin ?? undefined
            });
        } catch (error) {
            console.error("Erro ao buscar usuário por email no UserRepositoryPrisma:", error);
            throw error;
        }
    
    }
    async findAll(): Promise<User[]> {
        try {
            const users = await prisma.user.findMany();
            const assembledUsers = await Promise.all(users.map(user => User.assemble({
                id: user.id,
                email: user.email,
                name: user.name,
                password: user.password,
                role: user.role  as 'admin' | 'user',
                phone: user.phone ?? undefined,
                isBlocked: user.isBlocked,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin ?? undefined
            })));
            return assembledUsers;
        } catch (error) {
            console.error("Erro ao buscar todos os usuários no UserRepositoryPrisma:", error);
            throw error;
        }
    }
    updateLastLogin(id: string, date: Date): Promise<void> {
        try {
            prisma.user.update({
                where: { id },
                data: { lastLogin: date }
            });
            return Promise.resolve();
        } catch (error) {
            console.error("Erro ao atualizar lastLogin no UserRepositoryPrisma:", error);
            throw error;
        }
    }
    update(user: User): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async delete(id: string): Promise<boolean> {
        try {
            await prisma.user.delete({
                where: { id }
            });
            return Promise.resolve(true);
        } catch (error) {
            console.error("Erro ao deletar usuário no UserRepositoryPrisma:", error);
            throw error;
        }
    }
    
}