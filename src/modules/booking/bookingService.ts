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
}
