export type createListingDTOInput = {
    title: string,
    description?: string,
    type: "CASA" | "APARTAMENTO" | "KITNET" | "QUARTO" | "SITIO" |  "LOJA" | "BOX" | "ARMAZEM" | "SALA" | "PREDIO" | "OUTRO",
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

        doesntPayWaterBill?: boolean,
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

export type createListingDTOOutput = {
    id: string,
}