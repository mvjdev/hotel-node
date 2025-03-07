import { prisma } from "../../config/prisma";
import { CreateRoomDtoType } from "./roomDto";

export class RoomService {
    async crrupdateRoom(data: CreateRoomDtoType) {
        const existinigRoom = await prisma.room.findUnique({
            where: {
                number: data.number,
            },
        });

        if (existinigRoom) {
            return prisma.room.update({
                where: {
                    id: existinigRoom.id,
                },
                data: {
                    type: data.type,
                    pricePerNight: data.pricePerNight,
                },
            });
        }

        return prisma.room.create({data});
    }

    async getRoomById(id: number) {
        console.log(`Searching room with ID: ${id}`); 
        return prisma.room.findUnique({
            
            where: {
                id,
            },
        });
    }

    async getAllRooms() {
        return prisma.room.findMany();
    }

    async getRoomByNumber(number: number) {
        return prisma.room.findUnique({
            where: {
                number,
            },
        });
    }

    async deleteRoom(id: number) {
        return prisma.room.delete({
            where: {
                id,
            },
        });
    }
}
