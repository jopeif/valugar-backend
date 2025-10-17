export type FindUserByIdInput = {
    id: string;
}

export type FindUserByIdOutput = {
    id: string;
    email: string;
    name: string;
    phone?: string | undefined;
    role: 'admin' | 'user';
    createdAt: Date;
    lastLogin?: Date | undefined;
    isBlocked: boolean;
    isMailVerified: boolean | undefined;
    profilePicture?: {
        id: string,
        url: string
    }
}