export type PropertyDetailsProps = {
    id: string,
    area: number,
    bedrooms: number,
    bathrooms: number,

    doesntPayWaterBill: boolean,
    hasGarage: boolean,
    isPetFriendly: boolean,
    hasCeramicFlooring: boolean,
    hasCeilingLining: boolean,
    hasBackyard: boolean,
    hasPool: boolean,
    hasSolarPanel: boolean,

    hasParkingLot: boolean,
    isAccessible: boolean,
    hasAirConditioner: boolean,
    hasChildArea: boolean,
    hasKitchen: boolean,
    hasWarehouse: boolean,

}

export class PropertyDetails {
    private constructor(private props: PropertyDetailsProps){}

    static build(
        area: number,
        bedrooms: number,
        bathrooms: number,
        doesntPayWaterBill?: boolean | null,
        hasGarage?: boolean | null,
        isPetFriendly?: boolean | null,
        hasCeramicFlooring?: boolean | null,
        hasCeilingLining?: boolean | null,
        hasBackyard?: boolean | null,
        hasPool?: boolean | null,
        hasSolarPanel?: boolean | null,
        hasParkingLot?: boolean,
        isAccessible?: boolean,
        hasAirConditioner?: boolean,
        hasChildArea?: boolean,
        hasKitchen?: boolean,
        hasWarehouse?: boolean,
    ): PropertyDetails {
        const props: PropertyDetailsProps = {
            id: crypto.randomUUID(),
            area,
            bedrooms,
            bathrooms,
            doesntPayWaterBill: doesntPayWaterBill ?? false,
            hasGarage: hasGarage ?? false,
            isPetFriendly: isPetFriendly ?? false,
            hasCeramicFlooring: hasCeramicFlooring ?? false,
            hasCeilingLining: hasCeilingLining ?? false,
            hasBackyard: hasBackyard ?? false,
            hasPool: hasPool ?? false,
            hasSolarPanel: hasSolarPanel ?? false,
            hasParkingLot: hasParkingLot ?? false, 
            isAccessible: isAccessible ?? false,
            hasAirConditioner: hasAirConditioner ?? false,
            hasChildArea: hasChildArea ?? false,
            hasKitchen: hasKitchen ?? false,
            hasWarehouse: hasWarehouse ?? false
            
        }
        return new PropertyDetails(props)
    }

    static assemble(props: PropertyDetailsProps){
        return new PropertyDetails(props)
    }

    getProps(){
        return this.props
    }
}