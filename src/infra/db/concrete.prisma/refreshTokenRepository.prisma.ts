import { User } from "../../../domain/entities/User";
import { RefreshTokenRepository } from "../../../domain/repositories/refreshToken.repository";
import { UserRepository } from "../../../domain/repositories/User.repository";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class RefreshTokenRepositoryPrisma implements RefreshTokenRepository {
    save(userId: string, token: string, expiresAt: Date): Promise<void> {
        try {
            prisma.refreshToken.create({
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
    findByToken(token: string): Promise<any | null> {
        throw new Error("Method not implemented.");
    }
    findByUserId(userId: string): Promise<any[] | null> {
        throw new Error("Method not implemented.");
    }
    deleteByToken(token: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    deleteAllFromUser(userId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    
}