import { db } from '@/server';
import { orders } from '@/server/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
    const stripe = new Stripe(process.env.STRIPE_SECRET! || "", {
        apiVersion: "2024-09-30.acacia"
    })
    const sig = req.headers.get("stripe-signature") || ""
    const signingSecret = process.env.STRIPE_WEBHOOK_SECRET || ""

    // Read the request body as text
    const reqText = await req.text()
    // Convert the text to a buffer
    const reqBuffer = Buffer.from(reqText)

    let event

    try {
        event = stripe.webhooks.constructEvent(reqBuffer, sig, signingSecret);
    } catch (err: unknown) {
        if (err instanceof Stripe.errors.StripeSignatureVerificationError) {
            return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
        }
        return new NextResponse(`Unknown Error: ${String(err)}`, { status: 500 });
    }

    switch (event.type) {
        case "payment_intent.succeeded":
            const retrieveOrder = await stripe.paymentIntents.retrieve(
                event.data.object.id,
                { expand: ["latest_charge"] }
            )
            const charge = retrieveOrder.latest_charge as Stripe.Charge;

            await db.update(orders)
                .set({
                    status: "succeeded",
                    receiptURL: charge.receipt_url
                })
                .where(eq(orders.paymentIntentId, event.data.object.id))
                .returning()
            break;
        default:
            console.log(event.type)

    }
    return new Response("ok", { status: 200 })
}