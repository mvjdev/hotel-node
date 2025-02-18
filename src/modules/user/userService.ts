import { prisma } from "../../config/prisma";

export class UserService {

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
