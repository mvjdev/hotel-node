import { z } from "zod";

export const CreateUserDto = z.object({
    name: z.string(),
    email: z.string().email('Invalid email'),
});

export type CreateUserDtoType = z.infer<typeof CreateUserDto>;
