import * as z from 'zod'

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Invalid Email address"
    }),

    password: z.string().min(8, {
        message: "Password must be at least 8 character long"
    }),

    name: z.string().min(4, { message: 'Please add a name with least 4 char' })
})