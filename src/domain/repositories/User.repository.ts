import { User } from "../entities/User";

export interface UserRepository {
    save(user: User): Promise<string>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    updateLastLogin(id: string, date: Date): Promise<void>;
    update(user: User): Promise<boolean>;
    delete(id: string): Promise<boolean>;
}