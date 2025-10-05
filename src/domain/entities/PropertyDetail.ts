export type PropertyDetailsProps = {
    id: string,
    area: string,
    bedrooms: number,
    bathrooms: number
}

export class PropertyDetails {
    private constructor(private props: PropertyDetailsProps){}

    static build(
        area: string,
        bedrooms: number,
        bathrooms: number
    ): PropertyDetails {
        const props: PropertyDetailsProps = {
            id: crypto.randomUUID(),
            area,
            bedrooms,
            bathrooms
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