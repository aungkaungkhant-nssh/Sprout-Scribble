"use client"
import { useCartStore } from '@/lib/client-store';
import { PaymentElement, AddressElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { Button } from '../ui/button';
import { createPaymentIntent } from '@/server/actions/create-payment-intent';
import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { createOrder } from '@/server/actions/create-order';
import { toast } from 'sonner'
export default function PaymentForm({ totalPrice }: { totalPrice: number }) {

    const stripe = useStripe();
    const elements = useElements();
    const { cart, setCheckoutProgress, clearCart } = useCartStore();
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const { execute } = useAction(createOrder, {
        onSuccess: ({ data }) => {
            if (data?.error) {
                toast.error(data.error)
            }
            if (data?.success) {
                setIsLoading(false)
                toast.success(data.success)
                clearCart()
                setCheckoutProgress("confirmation-page");
            }
        }
    })
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        if (!stripe || !elements) {
            return setIsLoading(false)
        }
        const { error: submitError } = await elements.submit();
        if (submitError) {

            setIsLoading(false);
            return
        }

        const data = await createPaymentIntent({
            amount: totalPrice,
            currency: "usd",
            cart: cart.map((item) => ({
                quantity: item.variant.quantity,
                productId: item.id,
                title: item.name,
                price: item.price,
                image: item.image,
            })),
        })

        if (data?.data?.error) {

            setIsLoading(false)
            router.push("/auth/login")

            return
        }
        if (data?.data?.success) {
            const { error } = await stripe.confirmPayment({
                elements,
                clientSecret: data.data.success.clientSecretId!,
                redirect: "if_required",
                confirmParams: {
                    return_url: "http://localhost:3000/success",
                    receipt_email: data.data.success.user as string,
                }
            })
            if (error) {

                setIsLoading(false)
                return
            } else {
                setIsLoading(false);
                execute({
                    status: "pending",
                    paymentIntentId: data.data.success.paymentIntentId,
                    total: totalPrice,
                    products: cart.map((item) => ({
                        productId: item.id,
                        variantId: item.variant.variantId,
                        quantity: item.variant.quantity,
                    })),
                })
            }
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <AddressElement options={{ mode: "shipping" }} />
            <Button disabled={!stripe || !elements || isLoading} className='bg-primary my-4 w-full' type='submit'>
                {isLoading ? "Processing..." : "Pay now"}
            </Button>
        </form>
    )
}