export type MediaProps = {
    id: string,
    title: string,
    description: string | null,
    type:"IMAGE" | "VIDEO",
    url:string,
    listingId:string
}
export class Media{
    private constructor(private readonly props:MediaProps){}

    public static build(title: string, description: string,type:"IMAGE" | "VIDEO", url:string, listingId:string){
        const id = crypto.randomUUID()
        url = `/media/${url}`

        return new Media({id, title, description, type, url, listingId})
    }

    public static assemble(props:MediaProps){
        return new Media(props)
    }

    public static deleteMedia(url: string){
        throw new Error("Method not implemented.")
    }

    public getProps(){
        return this.props
    }
}