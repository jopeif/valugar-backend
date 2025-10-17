export type ProfilePictureProps = {
    id: string,
    url: string,
    userId: string
}

export class ProfilePicture{
    private constructor(private readonly props: ProfilePictureProps){}

    static build(
        url:string, userId: string
    ){
        const id = crypto.randomUUID()

        return new ProfilePicture({id, url, userId})
    }

    static assemble(props: ProfilePictureProps){
        return new ProfilePicture(props)
    }

    getProps(){
        return this.props
    }
}