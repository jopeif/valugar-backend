import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || "default_secret";

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Token not provided" });
        return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ error: "Token not provided" });
        return;
    }

    try {
        const payload = jwt.verify(token as string, JWT_SECRET);
        (req as Request & { user?: any }).user = payload;
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
}

