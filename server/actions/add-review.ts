"use server"
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { and, eq } from "drizzle-orm";
import { reviewSchema } from "@/types/review.schema";
import { auth } from "../auth";
import { reviews } from "../schema";
import { revalidatePath } from "next/cache";

const actionClient = createSafeActionClient();

export const addReview = actionClient
    .schema(reviewSchema)
    .action(async ({ parsedInput: { comment, rating, productId } }) => {
        try {
            const session = await auth();
            if (!session) return { error: "Please sign in" }
            const reviewExists = await db.query.reviews.findFirst({
                where: and(
                    eq(reviews.productId, productId),
                    eq(reviews.userId, session.user.id)
                )
            })
            if (reviewExists) return { error: "Your have already reviewed this product" }
            await db.insert(reviews).values({
                productId,
                rating,
                comment,
                userId: session.user.id
            }).returning()
            revalidatePath(`/products/${productId}`)
            return { success: `You have been review this product` }
        } catch {
            return { error: "Something went wrong" }
        }
    })
