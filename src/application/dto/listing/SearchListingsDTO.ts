export type SearchListingDTOInput = {
    page: number,
    pageSize: number,
    query?: string,
    minPrice?: number,
    maxPrice?: number,
    minBedrooms?: number,
    maxBedrooms?: number,
    propertyCategory?: "RESIDENTIAL" | "COMMERCIAL" | "MIXED_USE",
    type?: "CASA" | "APARTAMENTO" | "KITNET" | "QUARTO" | "SITIO" |  "LOJA" | "BOX" | "ARMAZEM" | "SALA" | "PREDIO" | "OUTRO",
    details?: {
        hasGarage?: boolean,
        isPetFriendly?: boolean,
        hasCeramicFlooring?: boolean,
        hasCeilingLining?: boolean,
        hasBackyard?: boolean,
        hasPool?: boolean,
        hasSolarPanel?: boolean,
        hasParkingLot?: boolean,
        isAccessible?: boolean,
        hasAirConditioner?: boolean,
        hasChildArea?: boolean,
        hasKitchen?: boolean,
        hasWarehouse?: boolean,
    }
}

export type SearchListingsDTOOutput = {
    listings:
        {
            id: string,
            title: string,
            description: string | null,
            type?: "CASA" | "APARTAMENTO" | "KITNET" | "QUARTO" | "SITIO" |  "LOJA" | "BOX" | "ARMAZEM" | "SALA" | "PREDIO" | "OUTRO",
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
                hasGarage: boolean,
                isPetFriendly: boolean,
                hasCeramicFlooring: boolean,
                hasCeilingLining: boolean,
                hasBackyard: boolean,
                hasPool: boolean,
                hasSolarPanel: boolean,
                hasParkingLot?: boolean,
                isAccessible?: boolean,
                hasAirConditioner?: boolean,
                hasChildArea?: boolean,
                hasKitchen?: boolean,
                hasWarehouse?: boolean,
            }
        }[],
        totalPages:number
}