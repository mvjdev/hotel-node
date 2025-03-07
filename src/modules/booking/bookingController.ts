import { Router, Request, Response } from "express";
import { BookingService } from "./bookingService";
import { CreateBookingDto } from "./bookingDto";
import { UpdateBookingStatusDto } from "./bookingDto";
import { authenticateJWT, authorizeRole } from "../../middlewares/authMiddleware";

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

bookingRouter.delete("/booking/:id", authenticateJWT, authorizeRole("USER"), async (req, res) => {
    await bookingService.deleteBooking(Number(req.params.id));
    res.json({ message: "Booking deleted" });
});

bookingRouter.get(
    "/room/:roomId/availability",
    async (
        req: any,
        res: any
    ) => {
        try {
            const { roomId } = req.params;
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return res.status(400).json({ error: "Missing startDate or endDate" });
            }

            const available = await bookingService.isRoomAvailable(
                Number(roomId),
                new Date(startDate),
                new Date(endDate)
            );

            return res.json({ available });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
);

bookingRouter.get("/user/:userId/bookings", async (req, res) => {
    try {
        const { userId } = req.params;
        const bookings = await bookingService.getBookingsByUser(Number(userId));
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

bookingRouter.put(
    "/booking/:bookingId/cancel",
    async (req: any, res: any) => {
        try {
            const { bookingId } = req.params;

            const booking = await bookingService.getBookingById(Number(bookingId));
            if (!booking) {
                return res.status(404).json({ error: "Booking not found" });
            }

            const cancelled = await bookingService.cancelBooking(Number(bookingId), false);

            if (!cancelled) {
                return res.status(400).json({ error: "Could not cancel the booking" });
            }

            return res.json({ message: "Booking canceled successfully", refunded: false });
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }
);

bookingRouter.get("/booking/:id/total-cost", async (req: any, res: any) => {
    try {
        const bookingId = Number(req.params.id);

        if (isNaN(bookingId)) {
            return res.status(400).json({ error: "Invalid booking ID" });
        }

        const totalPrice = await bookingService.getTotalPrice(bookingId);
            console.log("Total Price:", totalPrice);  // Logue le total price ici

        res.json({ totalCost: totalPrice });
    } catch (error) {
        console.error("Error getting total price:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default bookingRouter;
