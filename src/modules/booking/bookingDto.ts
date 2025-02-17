import { z } from "zod";

export const CreateBookingDto = z.object({
    userId: z.number().int(),
    roomIds: z.array(z.number().int()),
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }),
    endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }),
});

export const UpdateBookingStatusDto = z.object({
    status: z.enum(["CONFIRMED", "CANCELLED"]),
});

export type CreateBookingDtoType = z.infer<typeof CreateBookingDto>;
export type UpdateBookingStatusDtoType = z.infer<typeof UpdateBookingStatusDto>;
