import { CreateListingUseCase } from "../../../application/usecase/listing/createListing";
import { Request, Response } from "express";
import { DeleteListingUseCase } from "../../../application/usecase/listing/deleteListing";
import { FindListingByIdUseCase } from "../../../application/usecase/listing/findListingById";

export class listingController{

    constructor(
        public readonly createListingUseCase:CreateListingUseCase,
        public readonly deleteListingUseCase:DeleteListingUseCase,
        public readonly findByIdUseCase:FindListingByIdUseCase,
    ){}

    public async create(req:Request, res:Response){
        try {

            const { title, description, type, category, basePrice, iptu, userId, address, details } = req.body;
            const createListingUseCase = await this.createListingUseCase.execute({title, description, type, category, basePrice, iptu, userId, address, details});
            res.status(201).json(await createListingUseCase);
        } catch (error) {
            res.status(400).json({ error });
        }
    }

    public async delete(req:Request, res:Response){
        try {
            const { id } = req.params;

            if(!id){
                return res.status(400).json({ error: "ID is required" });
            }

            const deleteListingUseCase = await this.deleteListingUseCase.execute({id});
            res.status(200).json(await deleteListingUseCase);
        } catch (error) {
            res.status(400).json({ error });
        }
    }

    public async findById(req:Request, res:Response){
        try {
            const { id } = req.params;
            if(!id){
                return res.status(400).json({ error: "ID is required" });
            }
            const findByIdUseCase = await this.findByIdUseCase.execute({id});
            res.status(200).json(await findByIdUseCase);
        } catch (error) {
            res.status(400).json({ error });
        }
    }


}