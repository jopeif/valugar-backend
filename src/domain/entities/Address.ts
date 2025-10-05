export type AddressProps = {
    id: String,
    zipCode: String,
    state: String,
    city: String,
    neighborhood: String,
    street: String,
    reference: String | null,
}

export class Address {
    private constructor(private props: AddressProps){}

    static build(
        zipCode: String,
        state: String,
        city: String,
        neighborhood: String,
        street: String,
        reference: String | null
    ): Address {
        const props: AddressProps = {
            id: crypto.randomUUID(),
            zipCode,
            state,
            city,
            neighborhood,
            street,
            reference
        }
        return new Address(props)
    }

    static assemble(props: AddressProps){
        return new Address(props)
    }

    getProps(){
        return this.props
    }
}