import { User } from "../../../domain/entities/User";
import { RefreshTokenRepository } from "../../../domain/repositories/refreshToken.repository";
import { UserRepository } from "../../../domain/repositories/User.repository";
import { prisma } from "../prisma";

export class RefreshTokenRepositoryPrisma implements RefreshTokenRepository {
    async save(userId: string, token: string, expiresAt: Date): Promise<void> {
        try {
            await prisma.refreshToken.create({
                data: {
                    token,
                    userId,
                    expiresAt
                }
            });
            return Promise.resolve();
        } catch (error) {
            console.error("Erro ao salvar refresh token no RefreshTokenRepositoryPrisma:", error);
            throw error;
        }
    }
    async findByToken(token: string): Promise<any | null> {
        try {
            return await prisma.refreshToken.findUnique({
                where: { token }
            });
        } catch (error) {
            console.error("Erro ao buscar refresh token no RefreshTokenRepositoryPrisma:", error);
            throw error;
        }
    }
    findByUserId(userId: string): Promise<any[] | null> {
        throw new Error("Method not implemented.");
    }
    deleteByToken(token: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async deleteAllFromUser(userId: string): Promise<void> {
        try {
            await prisma.refreshToken.deleteMany({
                where: { userId }
            });
        } catch (error) {
            console.error("Erro ao deletar refresh tokens no RefreshTokenRepositoryPrisma:", error);
            throw error;
        }
    }
    
    
}