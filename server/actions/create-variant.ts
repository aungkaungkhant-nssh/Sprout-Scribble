"use server"

import { VariantSchema } from "@/types/variant-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { products, productVariants, variantImages, variantTags } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { algoliasearch } from "algoliasearch";

const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_ID!,
    process.env.ALGOLIA_ADMIN!

);

const actionClient = createSafeActionClient();
export const createVariant = actionClient
    .schema(VariantSchema)
    .action(async ({ parsedInput: { productId, productType, id, editMode, color, tags, variantImages: newImgs } }) => {
        try {
            if (editMode && id) {
                const editVariant = await db.update(productVariants)
                    .set({ color, productType, updated: new Date() })
                    .where(eq(productVariants.id, id))
                    .returning();

                if (editVariant.length > 0) {
                    await db.delete(variantTags).where(eq(variantTags.variantId, editVariant[0].id));

                    // Insert variantTags only if there are tags
                    if (tags && tags.length > 0) {
                        await db.insert(variantTags).values(
                            tags.map((tag) => ({
                                tag,
                                variantId: editVariant[0].id
                            }))
                        );
                    }

                    await db.delete(variantImages).where(eq(variantImages.variantId, editVariant[0].id));

                    // Insert variantImages only if there are new images
                    if (newImgs && newImgs.length > 0) {
                        await db.insert(variantImages).values(
                            newImgs.map((img, index) => ({
                                name: img.name,
                                size: img.size,
                                url: img.url,
                                variantId: editVariant[0].id,
                                order: index
                            }))
                        );
                    }

                    await client.partialUpdateObject({
                        indexName: "product_variant",
                        objectID: editVariant[0].id.toString(),
                        attributesToUpdate: {
                            id: editVariant[0].productId,
                            productType: editVariant[0].productType,
                            variantImages: newImgs[0]?.url
                        }
                    });

                    revalidatePath("/dashboard/products");
                    return { success: `Edited ${productType}` };
                }
            }

            if (!editMode) {
                const newVariant = await db.insert(productVariants)
                    .values({
                        color,
                        productType,
                        productId
                    })
                    .returning();

                if (newVariant.length > 0) {
                    const product = await db.query.products.findFirst({
                        where: eq(products.id, productId)
                    });

                    // Insert variantTags only if there are tags
                    if (tags && tags.length > 0) {
                        await db.insert(variantTags).values(
                            tags.map((tag) => ({
                                tag,
                                variantId: newVariant[0].id
                            }))
                        );
                    }

                    // Insert variantImages only if there are new images
                    if (newImgs && newImgs.length > 0) {
                        await db.insert(variantImages).values(
                            newImgs.map((img, index) => ({
                                name: img.name,
                                size: img.size,
                                url: img.url,
                                variantId: newVariant[0].id,
                                order: index
                            }))
                        );
                    }

                    if (product) {
                        await client.saveObject({
                            indexName: "product_variant",
                            body: {
                                objectID: newVariant[0].id.toString(),
                                id: newVariant[0].productId,
                                title: product.title,
                                price: product.price,
                                productType: newVariant[0].productType,
                                variantImages: newImgs[0]?.url
                            }
                        });
                    }
                    revalidatePath("/dashboard/products");
                    return { success: `Added ${productType}` };
                }
            }
        } catch (err) {
            console.log(err);
            return { error: "Failed to create variant" };
        }
    });
