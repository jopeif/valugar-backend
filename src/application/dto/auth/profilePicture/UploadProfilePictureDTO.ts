export type UploadProfilePictureDTOInput = {
    userId: string, 
    file: Express.Multer.File
}

export type UploadProfilePictureDTOOutput = {
    media:string
}