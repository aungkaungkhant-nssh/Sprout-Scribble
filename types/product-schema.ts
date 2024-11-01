import * as z from "zod"

export const ProductSchema = z.object({
    id: z.number().optional(),
    title: z.string().min(5, {
        message: "Title must be at least 5 character long"
    }),
    description: z.string().min(40, {
        message: "Description must be at least 40 character long"
    }),
    price: z.coerce
        .number({ invalid_type_error: "Price must be a number" })
        .positive({ message: "Price must be positive number" })
})