import * as z from 'zod'

export const reviewSchema = z.object({
    productId: z.number(),
    rating: z.number().min(1, { message: "Please add at least one star" })
        .max(5, { message: "Please add no more than 5 start" }),
    comment: z.string().min(5, { message: "Please add at least 5 character for this review" })
})