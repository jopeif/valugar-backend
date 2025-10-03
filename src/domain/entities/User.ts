import { hash } from "bcrypt";
import validator from "validator"; 
import crypto from "crypto";
import bcrypt from "bcrypt";

export type UserProps = {
    id: string;
    email: string;
    name: string;
    password: string;
    phone?: string | undefined;
    role: 'admin' | 'user';
    createdAt: Date;
    lastLogin?: Date | undefined;
    isBlocked: boolean;
    isMailVerified?: boolean;
    mailVerificationToken?: string | undefined;
};

export class User {
    constructor(private readonly props: UserProps) {}

    public static async build(
        email: string,
        name: string,
        password: string,
        role: 'admin' | 'user',
        phone?: string,
        mailVerificationToken?: string
    ):Promise<User> {

        // validações
        if (!validator.isEmail(email)) {
            throw new Error("Invalid E-mail");
        }

        if (validator.isEmpty(name.trim())) {
            throw new Error("Name cannot be empty");
        }

        if (!validator.isLength(password, { min: 8 })) {
            throw new Error("Password must be at least 8 characters long");
        }
        if (!validator.matches(password, /[A-Z]/)){
            throw new Error("Password must contain at least one uppercase letter")
        }
        if (!validator.matches(password, /[a-z]/)){
            throw new Error("Password must contain at least one lowercase letter")
        }
        if(!validator.matches(password, /[0-9]/)){
            throw new Error("Password must contain at least one number")
        }
        if(!validator.matches(password, /[^A-Za-z0-9]/)){
            throw new Error("Password must contain at least one special character")
        }
        if (phone && !validator.isMobilePhone(phone, 'pt-BR')) {
            throw new Error("Telefone inválido");
        }

        const id = crypto.randomUUID().toString();
        const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
        const hashedPassword = await hash(password, saltRounds);

        const user = new User({
            id,
            email,
            name,
            password: hashedPassword,
            phone,
            role,
            createdAt: new Date(),
            isBlocked: false,
            isMailVerified: false,
            mailVerificationToken,
        });

        return user;
    }

    public static async assemble(props: UserProps):Promise<User> {
        return new User(props);
    }

    public toggleIsBlocked(){
        this.props.isBlocked = !this.props.isBlocked;
    }

    public getProps(): UserProps {
        return this.props;
    }

    public updateLastLogin(){
        this.props.lastLogin = new Date();
    }

    public async checkPassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.props.password);
    }

    public setMailVerified(status: boolean){
        this.props.isMailVerified = status;
    }
}
