export type createListingDTOInput = {
    title: string,
    description?: string,
    type: "SALE" | "RENT",
    category: "RESIDENTIAL" | "COMMERCIAL" | "MIXED_USE",
    basePrice: number,
    iptu?: number,
    userId: string,
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

export type createListingDTOOutput = {
    id: string,
}