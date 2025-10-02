import { LoginUseCase } from '../../../application/usecase/auth/login';
import { RegisterUserUseCase } from './../../../application/usecase/auth/registerUser';
import { FindAllUsersUseCase } from '../../../application/usecase/auth/findAllUsers';
import { Request, Response } from "express";
import { DeleteUserUseCase } from '../../../application/usecase/auth/deleteUser';
import { FindUserByIdUseCase } from '../../../application/usecase/auth/findUserById';
import { FindUserByEmailUseCase } from '../../../application/usecase/auth/findUserByEmail';
import { RegisterAdminUseCase } from '../../../application/usecase/auth/registerAdmin';

export class AuthController {
    constructor(
        private readonly registerUserUseCase: RegisterUserUseCase, 
        private readonly registerAdminUseCase: RegisterAdminUseCase,
        private readonly loginUseCase: LoginUseCase, 
        private readonly findAllUsersUseCase: FindAllUsersUseCase, 
        private readonly deleteUserUseCase: DeleteUserUseCase,
        private readonly findUserByIdUseCase: FindUserByIdUseCase,
        private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
        
    ) {}

    public async registerUser(req: Request, res: Response){
        try{
            const {email, name, password, phone} = req.body
            const result = await this.registerUserUseCase.execute({
                email,
                name,
                password,
                phone
            })
            res.status(200).json(result);
        }catch(error){
            console.error("Erro no auth.Controller, registerUser:", error);
            res.status(401).json({ error });
        }
    }

    public async registerAdmin(req: Request, res: Response){
        try{
            const {email, name, password, phone, creationCode} = req.body
            const result = await this.registerAdminUseCase.execute({
                email,
                name,
                password,
                phone,
                creationCode
            })
            res.status(200).json(result);
        }catch(error){
            console.error("Erro no auth.Controller, registerUser:", error);
            res.status(401).json({ error });
        }
    }

    public async login(req: Request, res: Response){
        try{
            const {email, password} = req.body
            const result = await this.loginUseCase.execute({
                email,
                password
            })
            res.status(200).json(result);
        }catch(error){
            console.error("Erro no auth.Controller, login:", error);
            res.status(401).json({ error });
        }
    }

    public async findAllUsers(req: Request, res: Response){
        try{
            const result = await this.findAllUsersUseCase.execute();
            res.status(200).json(result);
        }catch(error){
            console.error("Erro no auth.Controller, findAllUsers:", error);
            res.status(401).json({ error });
        }
    }

    public async deleteUser(req: Request, res: Response){
        try{
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: "User ID is required" });
            }
            const result = await this.deleteUserUseCase.execute({ id });
            res.status(200).json(result);
        }catch(error){
            console.error("Erro no auth.Controller, deleteUser:", error);
            res.status(401).json({ error });
        }
    }

    public async findUserById(req: Request, res: Response){
        try{
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: "User ID is required" });
            }
            const result = await this.findUserByIdUseCase.execute({ id });
            res.status(200).json(result);
        }catch(error){
            console.error("Erro no auth.Controller, findUserById:", error);
            res.status(401).json({ error });
        }
    }

    public async findUserByEmail(req: Request, res: Response){
        try{
            const { email } = req.params;
            if (!email) {
                return res.status(400).json({ error: "User email is required" });
            }
            const result = await this.findUserByEmailUseCase.execute({ email });
            res.status(200).json(result);
        }catch(error){
            console.error("Erro no auth.Controller, findUserByEmail:", error);
            res.status(401).json({ error });
        }

    }
    
}