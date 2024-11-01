"use server"
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { createOrderSchema } from "@/types/create-order-schema";
import { auth } from "../auth";
import { orderProduct, orders } from "../schema";


const actionClient = createSafeActionClient();

export const createOrder = actionClient
    .schema(createOrderSchema)
    .action(async ({ parsedInput: { products, status, total, paymentIntentId } }) => {
        const user = await auth();

        if (!user) return { error: "User not found" }

        const order = await db.insert(orders).values({
            status,
            total,
            paymentIntentId,
            userId: user.user.id
        }).returning()

        products.map(async ({ productId, variantId, quantity }) => {
            await db.insert(orderProduct).values({
                productId,
                productVariantId: variantId,
                quantity,
                orderId: order[0].id
            })
        })
        return { success: "Order has been added" }
    })