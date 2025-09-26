import { LoginUseCase } from '../../../application/usecase/auth/login';
import { RegisterUserUseCase } from './../../../application/usecase/auth/registerUser';
import { Request, Response } from "express";

export class AuthController {
    constructor(private readonly registerUserUseCase: RegisterUserUseCase, private readonly loginUseCase: LoginUseCase) {}

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
}