"use server"
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import * as z from 'zod'
import { productVariants } from "../schema";
import { algoliasearch } from "algoliasearch";

const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_ID!,
    process.env.ALGOLIA_ADMIN!

);

const actionClient = createSafeActionClient();

export const deleteVariant = actionClient
    .schema(z.object({ id: z.number() }))
    .action(async ({ parsedInput: { id } }) => {
        try {
            const deletedVariant = await db
                .delete(productVariants)
                .where(eq(productVariants.id, id))
                .returning()

            revalidatePath("/dashboard/products")
            await client.deleteObject({ indexName: "product_variant", objectID: deletedVariant[0].id.toString() })
            return { success: `Deleted ${deletedVariant[0].productType}` }
        } catch {
            return { error: "Failed to delete product" }
        }
    })