export type RegisterAdminInput = {
    email: string;
    name: string;
    password: string;
    phone?: string | undefined;
    creationCode: string;
}

export type RegisterAdminOutput = {
    id:string
}