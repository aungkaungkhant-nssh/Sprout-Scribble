
"use client"
import { VariantsWithImagesTags } from "@/lib/infer-type";
import React, { useMemo, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VariantSchema } from "@/types/variant-schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputTags } from "./input-tags";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import VariantImages from "./variant-images";
import { createVariant } from "@/server/actions/create-variant";
import { deleteVariant } from "@/server/actions/delete-variant";

export function ProductVariant(
    {
        editMode,
        productId,
        variant,
        children
    }:
        {
            editMode: boolean,
            productId: number,
            variant?: VariantsWithImagesTags,
            children?: React.ReactNode
        }
) {
    const { execute, status } = useAction(createVariant, {
        onSuccess: ({ data }) => {
            toast.dismiss()
            if (data?.error) {
                toast.error(data.error)
            }
            if (data?.success) {
                // router.push("/dashboard/products")
                toast.success(data.success)
            }
        },
        onExecute: () => {
            if (editMode) {
                toast.loading("Editing Product Variant")
            } else {
                toast.loading("Creating Product Variant")
            }

        }
    })

    const [open, setOpen] = useState(false)
    const variantAction = useAction(deleteVariant, {
        onExecute() {
            toast.loading("Deleting variant", { duration: 1 })
            setOpen(false)
        },
        onSuccess({ data }) {
            toast.dismiss();
            if (data?.error) {
                toast.error(data.error)
            }
            if (data?.success) {
                toast.success(data.success)
            }
        },
    })

    const onSubmit = async (values: z.infer<typeof VariantSchema>) => {
        execute(values)
    };
    const form = useForm<z.infer<typeof VariantSchema>>({
        resolver: zodResolver(VariantSchema),
        defaultValues: {
            tags: [],
            variantImages: [],
            color: "#00000",
            editMode,
            id: undefined,
            productId,
            productType: "Black Note Book"
        }
    })

    useMemo(() => {
        if (!editMode) {
            form.reset()
            return;
        }
        if (editMode && variant) {
            form.setValue("editMode", true)
            form.setValue("id", variant.id);
            form.setValue("productId", variant.productId);
            form.setValue("productType", variant.productType);
            form.setValue("color", variant.color)
            form.setValue(
                "tags",
                variant.variantTags.map((tag) => tag.tag)
            )
            form.setValue(
                "variantImages",
                variant.variantImages.map((img) => ({
                    name: img.name,
                    size: img.size,
                    url: img.url,
                }))
            )
        }
    }, [variant])



    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-[850px]">
                <DialogHeader>
                    <DialogTitle>
                        {editMode ? "Edit" : "Create"} your variant
                    </DialogTitle>
                    <DialogDescription>
                        Manage your product variants here. You can add tags, images, and
                        more.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="productType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Variant Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Pick a  title for your variant" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Variant Color</FormLabel>
                                    <FormControl>
                                        <Input type="color"  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        <InputTags
                                            {...field}
                                            onChange={(e) => field.onChange(e)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <VariantImages />
                        <div className="flex gap-4 items-center justify-center">
                            {
                                editMode && variant && (
                                    <Button
                                        variant={"destructive"}
                                        type="button"
                                        disabled={
                                            variantAction.status === "executing"
                                        }
                                        onClick={(e) => {
                                            e.preventDefault()
                                            variantAction.execute({ id: variant.id })
                                        }}
                                    >
                                        Delete Variant
                                    </Button>
                                )
                            }
                            <Button
                                disabled={
                                    status === "executing"
                                }
                                type="submit"
                            >
                                {editMode ? "Update Variant" : "Create Variant"}
                            </Button>
                        </div>

                    </form>
                </Form>
            </DialogContent>

        </Dialog>
    )
}


