import { prisma } from "../../config/prisma";
import { CreateUserDtoType } from "./userDto";

export class UserService {
    async crupdateUser(data: CreateUserDtoType) {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });

        if (existingUser) {
            return prisma.user.update({
                where: {
                    id: existingUser.id,
                },
                data: {
                    name: data.name,
                    email: data.email,
                },
            });
        }

        return prisma.user.create({data});
    }

    async getUserById(id: number) {
        return prisma.user.findUnique({
            where: {
                id,
            },
        });
    }

    async getAllUsers() {
        return prisma.user.findMany();
    }

    async getUserByEmail(email: string) {
        return prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    async getUserByName(name: string) {
        return prisma.user.findFirst({
            where: {
                name,
            },
        });
    }

    async deleteUser(id: number) {
        return prisma.user.delete({
            where: {
                id,
            },
        });
    }
}
