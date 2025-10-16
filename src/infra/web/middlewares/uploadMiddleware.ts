
import multer from "multer";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";

const UPLOAD_DIR = path.resolve(__dirname, "../../../../uploads");


if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        cb(null, `${timestamp}_${file.originalname}`);
    },
});

const allowedMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/quicktime",
    "video/webm",
];

export const uploadMiddleware = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (allowedMimes.includes(file.mimetype)) cb(null, true);
        else cb(new Error("Formato de arquivo não permitido."));
    },
  limits: { fileSize: 50 * 1024 * 1024 },
});
