export type SearchListingDTOInput = {
    query?: string,
    minPrice?: number,
    maxPrice?: number,
    minBedrooms?: number,
    maxBedrooms?: number,
    propertyCategory?: "RESIDENTIAL" | "COMMERCIAL" | "MIXED_USE",
    listingType?: "SALE" | "RENT",
    page: number,
    pageSize: number
}

export type SearchListingsDTOOutput = {
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
}[]