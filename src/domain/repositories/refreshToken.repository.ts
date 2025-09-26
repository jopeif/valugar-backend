export interface RefreshTokenRepository {
    save(userId: string, token: string, expiresAt: Date): Promise<void>
    findByToken(token: string): Promise<any | null>
    findByUserId(userId:string): Promise<any[] | null>
    deleteByToken(token: string): Promise<void> 
    deleteAllFromUser(userId: string): Promise<void>
}