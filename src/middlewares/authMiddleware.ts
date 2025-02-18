import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

interface JwtPayload {
    userId: number;
    email: string;
    role: "USER" | "ADMIN";
}  

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
    }
  
    const token = authHeader.split(" ")[1];
  
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
        (req as any).user = decoded;
    
        next();
    } catch (error) {
        res.status(403).json({ message: "Forbidden: Invalid token" });
    }
};

export const authorizeRole = (role: "USER" | "ADMIN") => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = (req as any).user;
        
        if (!user || (user.role !== role && user.role !== "ADMIN")) {
            res.status(403).json({ message: "Forbidden: Insufficient permissions" });
            return;
        }

        next();
    };
};
