
import * as z from 'zod'


export const VariantSchema = z.object({
    productId: z.number(),
    id: z.number().optional(),
    editMode: z.boolean(),
    productType: z.string().min(3, { message: "Product type must be 3 character long" }),
    color: z.string().min(2, { message: "Color type must be 3 character long" }),
    tags: z.array(z.string().min(1, {
        message: "You must provide at least one tag"
    })),
    variantImages: z.array(z.object({
        url: z.string().refine((url) => url.search("blob:") !== 0, {
            message: "Please wait for the image to upload"
        }),
        size: z.number(),
        key: z.string().optional(),
        id: z.number().optional(),
        name: z.string()
    })).min(1, { message: "You must provide at least one image" })
})