"use server"
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { ProductSchema } from "@/types/product-schema";
import { products } from "../schema";
import { revalidatePath } from "next/cache";

const actionClient = createSafeActionClient();


export const createProduct = actionClient
    .schema(ProductSchema)
    .action(async ({ parsedInput: { title, id, price, description } }) => {
        if (id) {
            const currentProduct = await db.query.products.findFirst({
                where: eq(products.id, id)
            })
            if (!currentProduct) return { error: "Product not found" }
            const editdProduct = await db.update(products).set({ description, price, title })
                .where(eq(products.id, id))
                .returning()
            revalidatePath("/dashboard/products")
            return { success: `Product ${editdProduct[0].title} has been edited` }
        }
        const newProduct = await db.insert(products).values({ description, price, title }).returning()
        revalidatePath("/dashboard/products")
        return { success: `Product ${newProduct[0].title} has been created` }
    })