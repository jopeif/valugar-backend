import { Media } from "../entities/Media";

export interface MediaRepository{
    save(media:Media):Promise<string>;
    delete(id:string):Promise<boolean>;
    findByListingId(id:string):Promise<Media[] | null>
}