import fs from "fs/promises"; 
import path from "path";
import crypto from "crypto"; 
import { UploadConfig } from "./UploadConfig";
import { Express } from 'express'; 

export class LocalUploader {
    
    static async upload(
        file: Express.Multer.File, 
        config: UploadConfig,
        destPath: string,
        title?: string
    ): Promise<string> {
        if (!file) {
            throw new Error("Arquivo não fornecido.");
        }
        if (!config.allowedTypes.includes(file.mimetype)) {
            throw new Error(`Tipo de arquivo não permitido: ${file.mimetype}`);
        }
        if (file.size > config.maxSizeMB * 1024 * 1024) {
            throw new Error(`Arquivo '${file.originalname}' excede o tamanho máximo de ${config.maxSizeMB}MB.`);
        }

        const uploadDir = path.resolve(destPath);
        await fs.mkdir(uploadDir, { recursive: true });

        const fileExtension = path.extname(file.originalname);
        const randomName = title ? title : crypto.randomUUID();
        
        
        const filename = `${randomName}${fileExtension}`;
        const filePath = path.join(uploadDir, filename);

        await fs.writeFile(filePath, file.buffer);
        
        return filename;
    }
}