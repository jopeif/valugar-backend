export type FindMediaByListingIddDTOInput = {
    id:string
}

export type FindMediaByListingIddDTOOutput = {
    id: string,
    title: string,
    description: string,
    type:"IMAGE" | "VIDEO",
    url:string
}[] | null