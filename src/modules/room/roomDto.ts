import { z } from "zod";

export const CreateRoomDto = z.object({
    number: z.number().int(),
    type: z.string(),
    pricePerNight: z.number(),
});

export type CreateRoomDtoType = z.infer<typeof CreateRoomDto>;
