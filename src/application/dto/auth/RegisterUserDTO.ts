export type RegisterUserInput = {
    email: string;
    name: string;
    password: string;
    phone?: string | undefined;
}

export type RegisterUserOutput = {
    id:string
}