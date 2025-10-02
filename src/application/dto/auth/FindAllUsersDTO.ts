
export type FindAllUsersOutput = {
    id: string;
    email: string;
    name: string;
    phone?: string | undefined;
    role: 'admin' | 'user';
    createdAt: Date;
    lastLogin?: Date | undefined;
    isBlocked: boolean;
}[];