export type UploadMediaDTOInput = {
    title:string, 
    description: string, 
    listingId: string, 
    files: Express.Multer.File[]
}

export type UploadMediaDTOOutput = {
    medias:string[]
}