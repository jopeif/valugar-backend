import { CreateListingUseCase } from "../../../application/usecase/listing/createListing";
import { Request, Response } from "express";

export class listingController{

    constructor(public readonly createListingUseCase:CreateListingUseCase){}

    public async create(req:Request, res:Response){
        try {

            const { title, description, type, category, basePrice, iptu, userId, address, details } = req.body;
            const createListingUseCase = await this.createListingUseCase.execute({title, description, type, category, basePrice, iptu, userId, address, details});
            res.status(201).json(await createListingUseCase);
        } catch (error) {
            res.status(400).json({ error });
        }
    }


}