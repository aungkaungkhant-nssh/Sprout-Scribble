"use client"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "../ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Textarea } from "../ui/textarea"
import { Input } from "../ui/input"
import { motion } from 'framer-motion'
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { reviewSchema } from "@/types/review.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams } from "next/navigation"
import { useAction } from "next-safe-action/hooks"
import { addReview } from "@/server/actions/add-review"
import { toast } from "sonner"
export default function ReviewForm() {
    const params = useSearchParams()
    const productId = Number(params.get("productId"))
    const form = useForm<z.infer<typeof reviewSchema>>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 0,
            comment: "",
            productId
        }
    })
    const { status, execute } = useAction(addReview, {
        onSuccess({ data }) {
            if (data?.error) {
                toast.error(data.error);
            } else if (data?.success) {
                toast.success(data.success);
            }
        }
    });

    const onSubmit = async (values: z.infer<typeof reviewSchema>) => {
        execute(values)
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="font-medium w-full" variant={"secondary"}>
                    Leave a review
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <Form {...form}>
                    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            name="comment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Leave your review</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="How would you describe this product?"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="rating"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Leave your rating</FormLabel>
                                    <FormControl>
                                        <Input type="hidden" placeholder="Start Rating"  {...field} />
                                    </FormControl>
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((value) => {
                                            return (
                                                <motion.div
                                                    className="relative cursor-pointer"
                                                    whileTap={{ scale: 0.8 }}
                                                    whileHover={{ scale: 1.2 }}
                                                    key={value}
                                                >
                                                    <Star
                                                        onClick={() => {
                                                            form.setValue("rating", value, {
                                                                shouldValidate: true
                                                            })
                                                        }}
                                                        className={
                                                            cn(
                                                                "text-primary bg-transparent transition-all duration-300 ease-in-out",
                                                                form.getValues("rating") >= value
                                                                    ? "fill-primary"
                                                                    : "fill-muted"
                                                            )
                                                        }
                                                    />
                                                </motion.div>
                                            )
                                        })}
                                    </div>
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={status === "executing"}
                            className="w-full"
                            type="submit"
                        >
                            Submit
                        </Button>
                    </form>

                </Form>
            </PopoverContent>
        </Popover>
    )
}