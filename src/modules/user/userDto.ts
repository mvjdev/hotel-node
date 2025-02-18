import { z } from "zod";

export const CreateUserDto = z.object({
    name: z.string(),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export type CreateUserDtoType = z.infer<typeof CreateUserDto>;
