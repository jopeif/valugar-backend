import validator from "validator"; 

export type ListingProps = {
    id: string,
    title: string,
    description: string | null,
    type: "SALE" | "RENT",
    category: "RESIDENCIAL" | "COMMERCIAL" | "MIXED_USE",
    basePrice: Number,
    iptu: Number | null,
    userId: String,
    addressId: String | null,
    detailsId: String | null,
    createdAt: Date,
    updatedAt: Date | null,
}

export class Listing {
    private constructor(private props: ListingProps){}

    static build(
        title: string,
        type: "SALE" | "RENT",
        category: "RESIDENCIAL" | "COMMERCIAL" | "MIXED_USE",
        basePrice: number,
        userId: string,
        description: string | null,
        iptu: number | null,
        addressId: string | null,
        detailsId: string | null
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
                addressId,
                detailsId,
                createdAt,
                updatedAt
            }
        )
    }

    static assemble(props: ListingProps){
        return new Listing(props)
    }

    getprops(){
        return this.props
    }

}