import { Media } from "../../../domain/entities/Media";
import { MediaRepository } from "../../../domain/repositories/Media.repository";
import { prisma } from "../prisma";

export class MediaRepositoryPrisma implements MediaRepository{
    async save(media: Media): Promise<string> {
        try {
            const {id, title, description, type, url, listingId} = media.getProps()

            await prisma.media.create({data:{
                id,
                title,
                description,
                type,
                url,
                listingId,
            }})

            return id
        } catch (error) {
            throw error
        }
    }
    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    
    async findByListingId(id: string): Promise<Media[] | null> {
        try {
            const media = await prisma.media.findMany({
                where: {listingId:id}
            })

            if (!media) {
                return null;
            }

            return media.map(
                (m)=>{
                    return Media.assemble(m)
                }
            )
        } catch (error) {
            throw error
        }
    }

    async findById(id: string): Promise<Media | null> {
        try {
            const media = await prisma.media.findUnique({
                where:{
                    id
                }
            })

            if(!media){
                return null
            }

            const result = Media.assemble({
                id: media.id,
                title: media.title,
                description: media.description,
                type: media.type,
                url: media.url,
                listingId: media.listingId,
            })

            return result
        } catch (error) {
            throw error
        }
    }
}