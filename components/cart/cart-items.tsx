import { useCartStore } from "@/lib/client-store"
import { useMemo } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import formatPrice from "@/lib/format-price";
import Image from "next/image";
import { MinusCircle, PlusCircle } from "lucide-react";
import Lottie from 'lottie-react'
import emptyCart from "@/public/empty-box.json"
import { AnimatePresence, motion } from 'framer-motion'
import { createId } from "@paralleldrive/cuid2";
import { Button } from "../ui/button";

export default function CartItems() {
    const { cart, addToCart, removeFromCart, setCheckoutProgress } = useCartStore();
    const totalPrice = useMemo(() => {
        return cart.reduce((acc, item) => {
            return acc + item.price! * item.variant.quantity
        }, 0)
    }, [cart])
    const priceInLetter = useMemo(() => {
        return Array.from(totalPrice.toFixed(2).toString()).map((letter) => {
            return { letter, id: createId() }
        })
    }, [totalPrice])
    return (
        <motion.div className="flex flex-col items-center">
            {cart.length === 0 && (
                <div className="flex-col w-full flex items-center justify-center">
                    <motion.div
                        animate={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <h1 className="text-2xl text-muted-foreground text-center">Cart is empty</h1>
                        <Lottie animationData={emptyCart} className="h-64" />
                    </motion.div>

                </div>
            )}
            {
                cart.length > 0 && (
                    <div className="max-h-80 overflow-y-auto">
                        <Table className="max-w-4xl mx-auto">
                            <TableHeader>
                                <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Total</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    cart.map((item) => (
                                        <TableRow key={(item.id + item.variant.variantId)}>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{formatPrice(item.price)}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <Image
                                                        className="rounded-md"
                                                        src={item.image}
                                                        width={48}
                                                        height={48}
                                                        alt={item.name}
                                                        priority
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-between gap-2">
                                                    <MinusCircle
                                                        className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                                                        size={14}
                                                        onClick={() => {
                                                            removeFromCart({
                                                                ...item,
                                                                variant: {
                                                                    quantity: 1,
                                                                    variantId: item.variant.variantId
                                                                }
                                                            })
                                                        }}
                                                    />
                                                    <p className="text-md font-bold">{item.variant.quantity}</p>
                                                    <PlusCircle
                                                        className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                                                        size={14}
                                                        onClick={() => {
                                                            addToCart({
                                                                ...item,
                                                                variant: {
                                                                    quantity: 1,
                                                                    variantId: item.variant.variantId
                                                                }
                                                            })
                                                        }}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </div>
                )
            }
            <motion.div className="flex items-center justify-center relative my-4 overflow-hidden">
                <span className="text-md">Total: $</span>
                <AnimatePresence mode="popLayout">
                    {
                        priceInLetter.map((letter, i) => (
                            <motion.div key={letter.id}>
                                <motion.span
                                    initial={{ y: 20 }}
                                    animate={{ y: 0 }}
                                    exit={{ y: -20 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="text-md inline-block"
                                >
                                    {letter.letter}
                                </motion.span>
                            </motion.div>
                        ))
                    }
                </AnimatePresence>
            </motion.div>
            <Button
                className="max-w-md w-full bg-primary"
                onClick={() => {
                    setCheckoutProgress("payment-page")
                }}
            >
                Checkout
            </Button>
        </motion.div>
    )
}