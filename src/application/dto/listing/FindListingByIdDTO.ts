export type findListingByIdDTOInput = {
    id: string,
}

export type findListingByIdDTOOutput = {
    id: string,
    title: string,
    description: string | null,
    type: "CASA" | "APARTAMENTO" | "KITNET" | "QUARTO" | "SITIO" | "OUTRO",
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
    }
}