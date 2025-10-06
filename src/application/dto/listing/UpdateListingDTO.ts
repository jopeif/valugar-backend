export type UpdateListingDTOInput = {
    id: string,
    title: string,
    description: string | null,
    type: "SALE" | "RENT",
    category: "RESIDENCIAL" | "COMMERCIAL" | "MIXED_USE",
    basePrice: Number,
    iptu: Number | null,
    userId: string,
    createdAt: Date,
    updatedAt: Date | null,
    address: {
        zipCode: string,
        state: string,
        city: string,
        neighborhood: string,
        street: string,
        reference?: string | null,
    },
    details: {
        area: number,
        bedrooms: number,
        bathrooms: number,
    }
}

export type UpdateListingDTOOutput = {
    success: boolean
}