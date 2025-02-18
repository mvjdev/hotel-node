import { prisma } from "../../config/prisma";
import { CreateUserDtoType } from "./userDto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret"; // Remplace par une variable d'environnement sécurisée

export class UserService {
    async crupdateUser(data: CreateUserDtoType) {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        const hashedPassword = await bcrypt.hash(data.password, 10);

        if (existingUser) {
            return prisma.user.update({
                where: { id: existingUser.id },
                data: {
                    name: data.name,
                    email: data.email,
                    password: hashedPassword,
                },
            });
        }

        return prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
    }

    async loginUser(email: string, password: string) {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error("Mot de passe incorrect");
        }

        // Génération du token JWT
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

        return { token, user };
    }

    async getUserById(id: number) {
        return prisma.user.findUnique({ where: { id } });
    }

    async getAllUsers() {
        return prisma.user.findMany();
    }

    async getUserByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } });
    }

    async getUserByName(name: string) {
        return prisma.user.findFirst({ where: { name } });
    }

    async deleteUser(id: number) {
        return prisma.user.delete({ where: { id } });
    }
}
