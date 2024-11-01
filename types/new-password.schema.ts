import * as z from 'zod'

export const NewPasswordSchema = z.object({
    password: z.string().min(8, {
        message: "Password must be at least 8 character"
    }),
    token: z.string().nullable().optional()
})