"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProductSchema } from "@/types/product-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from 'zod'
import { DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button";
import Tiptap from "./tip-tap";
import { useAction } from "next-safe-action/hooks";
import { createProduct } from "@/server/actions/create-product";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { getProduct } from "@/server/actions/get-product";
import { useEffect } from "react";

export default function ProductForm() {
    const router = useRouter();
    const searchParam = useSearchParams();
    const editMode = searchParam.get("id")
    const form = useForm<z.infer<typeof ProductSchema>>({
        resolver: zodResolver(ProductSchema),
        defaultValues: {
            title: "",
            description: "",
            price: 0,
        },
        mode: "onChange"
    })

    const { execute, status } = useAction(createProduct, {
        onSuccess: ({ data }) => {
            toast.dismiss();
            if (data?.error) {
                toast.error(data.error)
            }
            if (data?.success) {
                router.push("/dashboard/products")
                toast.success(data.success)
            }
        },

        onExecute: () => {
            if (editMode) {
                toast.loading("Editing Product")
            } else {
                toast.loading("Creating Product")
            }

        }
    })

    const onSubmit = async (values: z.infer<typeof ProductSchema>) => {
        execute(values)
    };

    const checkProduct = async (id: number) => {
        if (editMode) {
            const data = await getProduct(id);
            if (data.error) {
                toast.error(data.error)
                router.push("/dashboard/products")
                return
            }

            if (data.success) {
                form.setValue("id", id)
                form.setValue("title", data.success.title)
                form.setValue("description", data.success.description);
                form.setValue("price", data.success.price);
            }
        }
    }
    useEffect(() => {
        if (editMode) {
            checkProduct(+editMode)
        }
    }, [])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Product</CardTitle>
                <CardDescription>Add a brand new product</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form} >
                    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Saedong Stripe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Tiptap val={field.value} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Price</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            <DollarSign
                                                size={36}
                                                className="p-2 bg-muted  rounded-md"
                                            />
                                            <Input
                                                {...field}
                                                type="number"
                                                placeholder="Your price in USD"
                                                step="0.1"
                                                min={0}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            disabled={status === "executing" || !form.formState.isValid ||
                                !form.formState.isDirty}
                            className="w-full"
                            type="submit"
                        >
                            {editMode ? "Edit Product" : "Create Product"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}