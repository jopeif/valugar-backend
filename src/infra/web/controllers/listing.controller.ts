import { FindMediaByListingIdUseCase } from './../../../application/usecase/listing/media/findMediaByListing';
import { UploadMediaUseCase } from '../../../application/usecase/listing/media/UploadListingMedia';
import { CreateListingUseCase } from "../../../application/usecase/listing/createListing";
import { Request, Response } from "express";
import { DeleteListingUseCase } from "../../../application/usecase/listing/deleteListing";
import { FindListingByIdUseCase } from "../../../application/usecase/listing/findListingById";
import { UpdateListingUseCase } from "../../../application/usecase/listing/updateListing";
import { SearchListingsUseCase } from "../../../application/usecase/listing/searchListings";
import { FindListingByUserUseCase } from "../../../application/usecase/listing/findListingByUser";
import multer from 'multer';
import { FindAllListing } from '../../../application/usecase/listing/findAllListings';

    
export class listingController{

    constructor(
        public readonly createListingUseCase:CreateListingUseCase,
        public readonly deleteListingUseCase:DeleteListingUseCase,
        public readonly findByIdUseCase:FindListingByIdUseCase,
        public readonly updateListingUseCase: UpdateListingUseCase,
        public readonly searchListingsUseCase: SearchListingsUseCase,
        public readonly findListingByUserUseCase: FindListingByUserUseCase,
        public readonly findAllListingsUseCase: FindAllListing,
        public readonly uploadMediaUseCase: UploadMediaUseCase,
        public readonly findMediaByListingUseCase: FindMediaByListingIdUseCase,
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
            
            if(!id || id.trim()===""){
                res.status(400).json({error: "ID is required"})
                return
            }

            const { title, description, type, category, basePrice, iptu, address, details} = req.body;
            const result = await this.updateListingUseCase.execute({ id, title, description, type, category, basePrice, iptu, address, details })

            res.status(200).json(result)
        } catch (error) {
            res.status(400).json({error})
        }
    }

    public async findAll(req: Request, res: Response) {
        try {
            const result = await this.findAllListingsUseCase.execute();
            return res.status(200).json(result);

        } catch (error: any) {
            return res.status(400).json({ error: error.message ?? "Unexpected error" });
        }
    }

    public async findById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: "ID is required" });
            }

            const result = await this.findByIdUseCase.execute({ id });
            return res.status(200).json(result);

        } catch (error: any) {

            if (error.message === "Listing not found") {
                return res.status(404).json({ error: "Listing not found" });
            }

            return res.status(400).json({ error: error.message ?? "Unexpected error" });
        }
    }


    public async searchListings(req: Request, res: Response){
        try {
            console.log("Cheguei aqui.")
            const { query, minPrice, maxPrice, minBedrooms, maxBedrooms, propertyCategory, listingType, details, page, pageSize } = req.body
            
            if(!query || query===""){
                throw new Error("Um termo de pesquisa deve ser enviado.")
            }

            const result = await this.searchListingsUseCase.execute({query, minPrice, maxPrice, minBedrooms, maxBedrooms, propertyCategory, type: listingType, details, page, pageSize})
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
    
    async uploadMedia(req: Request, res: Response) {
        try {
        const { listingId } = req.params;
        const { title, description } = req.body;
        const files = req.files as Express.Multer.File[];

        if(!listingId){
            throw new Error("É necessário enviar um id.")
        }

        if (!files || files.length === 0) {
            throw new Error("Nenhum arquivo foi enviado.");
        }

        const result = await this.uploadMediaUseCase.execute({
            listingId,
            title,
            description,
            files,
        });

        res.status(201).json(result);
        } catch (error: any) {
        res.status(400).json({ message: error.message });
        }
    }

    async findMedia(req: Request, res: Response) {
        try {
            const { listingId } = req.params;
            if(!listingId){
                throw new Error("ListingId é obrigatório.")
            }

            const result = await this.findMediaByListingUseCase.execute({id:listingId})
            res.status(200).json(result)
        } catch (error) {
            res.status(400).json({ message: error });
        }
    }
}


