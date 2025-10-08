import validator from "validator"; 
import { Address } from "./Address";
import { PropertyDetails } from "./PropertyDetail";

export type ListingProps = {
    id: string,
    title: string,
    description: string | null,
    type: "SALE" | "RENT",
    category: "RESIDENTIAL" | "COMMERCIAL" | "MIXED_USE",
    basePrice: Number,
    iptu: Number | null,
    userId: string,
    createdAt: Date,
    updatedAt: Date | null,
    address: Address,
    PropertyDetails: PropertyDetails
}

export class Listing {
    private constructor(private props: ListingProps){}

    static build(
        title: string,
        type: "SALE" | "RENT",
        category: "RESIDENTIAL" | "COMMERCIAL" | "MIXED_USE",
        basePrice: number,
        userId: string,
        description: string | null,
        iptu: number | null,
        address: Address,
        details: PropertyDetails,
    ){
        const id = crypto.randomUUID()
        const createdAt = new Date()
        const updatedAt = new Date()

        return new Listing(
            {
                id,
                title,
                description,
                type,
                category,
                basePrice,
                iptu,
                userId,
                createdAt,
                updatedAt,
                address,
                PropertyDetails: details

            }
        )
    }

    static assemble(props: ListingProps){
        return new Listing(props)
    }

    getProps(){
        return this.props
    }

}