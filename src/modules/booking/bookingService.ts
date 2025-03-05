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

    async cancelBooking(bookingId: number, refund: boolean): Promise<boolean> {
        const booking = await this.getBookingById(bookingId);
        if (!booking) return false;
    
        await prisma.booking.update({
            where: { id: bookingId },
            data: { status: "CANCELLED" }
        });
        
        return true;
    }

    async getTotalPrice(bookingId: number) {
        const booking = await this.getBookingById(bookingId);
        if (!booking) return 0;

        const startDate = new Date(booking.startDate);
        const endDate = new Date(booking.endDate);
        const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        
        const totalPrice = booking.rooms.reduce((total, room) => {
            return total + room.pricePerNight * nights;
        }, 0);

        return totalPrice;
    }
}
