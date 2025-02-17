import { Router } from "express";
import { BookingService } from "./bookingService";
import { CreateBookingDto } from "./bookingDto";
import { UpdateBookingStatusDto } from "./bookingDto";

const bookingService = new BookingService();
const bookingRouter = Router();

bookingRouter.post("/booking", async (req, res) => {
    try {
        const parsedData = CreateBookingDto.parse(req.body);
        const booking = await bookingService.createBooking(parsedData);
        res.status(201).json(booking);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(400).json({ error: "Invalid data" });
        }
    }
});

bookingRouter.get("/booking/:id", async (req, res) => {
    const booking = await bookingService.getBookingById(Number(req.params.id));
    res.json(booking);
});

bookingRouter.get("/bookings", async (req, res) => {
    const bookings = await bookingService.getAllBookings();
    res.json(bookings);
});

bookingRouter.patch("/booking/:id/status", async (req, res) => {
    try {
        const { status } = UpdateBookingStatusDto.parse(req.body);
        const updatedBooking = await bookingService.updateBookingStatus(
            Number(req.params.id),
            status
        );
        res.json(updatedBooking);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(400).json({ error: "Invalid status" });
        }
    }
});

bookingRouter.delete("/booking/:id", async (req, res) => {
    await bookingService.deleteBooking(Number(req.params.id));
    res.json({ message: "Booking deleted" });
});

export default bookingRouter;
