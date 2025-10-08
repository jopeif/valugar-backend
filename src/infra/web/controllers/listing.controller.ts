import { CreateListingUseCase } from "../../../application/usecase/listing/createListing";
import { Request, Response } from "express";
import { DeleteListingUseCase } from "../../../application/usecase/listing/deleteListing";
import { FindListingByIdUseCase } from "../../../application/usecase/listing/findListingById";
import { UpdateListingUseCase } from "../../../application/usecase/listing/updateListing";
import { SearchListingsUseCase } from "../../../application/usecase/listing/searchListings";
import { FindListingByUserUseCase } from "../../../application/usecase/listing/findListingByUser";

export class listingController{

    constructor(
        public readonly createListingUseCase:CreateListingUseCase,
        public readonly deleteListingUseCase:DeleteListingUseCase,
        public readonly findByIdUseCase:FindListingByIdUseCase,
        public readonly updateListingUseCase: UpdateListingUseCase,
        public readonly searchListingsUseCase: SearchListingsUseCase,
        public readonly findListingByUserUseCase: FindListingByUserUseCase,
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

    public async update(req:Request, res: Response){
        try {

            const { id } = req.params
            
            if(!id){
                res.status(400).json({error: "ID is required"})
                return
            }

            const { title, description, type, category, basePrice, iptu, userId, address, details, createdAt, updatedAt } = req.body;
            const result = await this.updateListingUseCase.execute({ id, title, description, type, category, basePrice, iptu, userId, address, details, createdAt, updatedAt })

            res.status(200).json(result)
        } catch (error) {
            res.status(400).json({error})
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

    public async searchListings(req: Request, res: Response){
        try {
            const { query, minPrice, maxPrice, minBedrooms, maxBedrooms, propertyCategory, listingType, page, pageSize } = req.body
            
            if(!query || typeof query !== 'string'){
                res.status(400).json({message:"Um termo de pesquisa deve ser enviado"})
            }

            const result = await this.searchListingsUseCase.execute({query, minPrice, maxPrice, minBedrooms, maxBedrooms, propertyCategory,listingType, page, pageSize})
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error })
        }
    }

    public async findListingByUser(req: Request, res: Response){
        try {
            const { id } = req.params

            if(!id){
                return res.status(400).json({ error: "ID is required" });
            }

            const result = await this.findListingByUserUseCase.execute({id})
            res.status(200).json(result)
        } catch (error) {
            res.status(400).json({ error })
        }
    }


}