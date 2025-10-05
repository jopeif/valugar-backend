import { CreateListingUseCase } from "../../../application/usecase/listing/createListing";
import { Request, Response } from "express";

export class listingController{

    constructor(public readonly createListingUseCase:CreateListingUseCase){}

    public async create(req:Request, res:Response){
        try {
            const { title, description, type, category, basePrice, iptu, userId, address, details } = req.body;
            const createListingUseCase = this.createListingUseCase.execute({title, description, type, category, basePrice, iptu, userId, address, details});
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

}