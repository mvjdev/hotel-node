import { prisma } from "../../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CreateUserDtoType } from "../user/userDto";

const JWT_SECRET = process.env.JWT_SECRET as string;

export class AuthService {
    async registerUser(data: CreateUserDtoType) {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });

        const hashedPassword = await bcrypt.hash(data.password, 10);
    
        if (existingUser) {
            const updatedUser = await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                    name: data.name,
                    email: data.email,
                    password: hashedPassword,
                },
            });
        
            const token = jwt.sign(
                { userId: updatedUser.id, email: updatedUser.email, role: updatedUser.role },
                JWT_SECRET,
                { expiresIn: "1h" }
            );
        
            return { token, user: updatedUser };
        }
    
        const user = await prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });

        const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
            
        return { token, user };
    }

    async loginUser(email: string, password: string) {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new Error("User not found");
        }
        
        if (!user.password) {
            throw new Error("Password is null");
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error("Invalid password");
        }
        
        const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
        return { token, user };
    }
}
