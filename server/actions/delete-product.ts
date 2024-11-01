"use server"
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import * as z from 'zod'
import { products } from "../schema";
const actionClient = createSafeActionClient();

export const deleteProduct = actionClient
    .schema(z.object({ id: z.number() }))
    .action(async ({ parsedInput: { id } }) => {
        try {
            const data = await db.delete(products).where(eq(products.id, id)).returning()
            revalidatePath("/dashboard/products")
            return { success: `Product ${data[0].title} has been deleted` }
        } catch {
            return { error: "Failed to delete product" }
        }
    })