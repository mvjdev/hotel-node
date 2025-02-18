import { prisma } from "../../config/prisma";
import { CreateBookingDtoType } from "./bookingDto";

export class BookingService {
    async createBooking(data: CreateBookingDtoType) {
        const { userId, roomIds, startDate, endDate } = data;

        return prisma.booking.create({
            data: {
                user: { connect: { id: userId } },
                rooms: { connect: roomIds.map((id) => ({ id })) },
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                status: "PENDING",
            },
        });
    }

    async getBookingById(id: number) {
        return prisma.booking.findUnique({
            where: { id },
            include: { user: true, rooms: true },
        });
    }

    async getAllBookings() {
        return prisma.booking.findMany({ include: { user: true, rooms: true } });
    }

    async updateBookingStatus(id: number, status: "CONFIRMED" | "CANCELLED") {
        return prisma.booking.update({
            where: { id },
            data: { status },
        });
    }

    async deleteBooking(id: number) {
        return prisma.booking.delete({
            where: { id },
        });
    }

    async isRoomAvailable(roomId: number, startDate: Date, endDate: Date): Promise<boolean> {
        const existingBooking = await prisma.booking.findFirst({
            where: {
                rooms: {
                    some: {
                        id: roomId
                    }
                },
                OR: [
                    { startDate: { lte: endDate }, endDate: { gte: startDate } }
                ]
            }
        });
        return !existingBooking;
    }

    async getBookingsByUser(userId: number) {
        return prisma.booking.findMany({
            where: { userId },
            include: { rooms: true }
        });
    }
}
