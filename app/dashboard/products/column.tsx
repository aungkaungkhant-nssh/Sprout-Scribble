"use client"
import { ColumnDef, Row } from '@tanstack/react-table'
import Image from 'next/image'
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useAction } from 'next-safe-action/hooks'
import { deleteProduct } from '@/server/actions/delete-product'
import { toast } from 'sonner'
import { VariantsWithImagesTags } from '@/lib/infer-type'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { ProductVariant } from './product-variant'

type ProductColumn = {
    title: string
    price: number
    image: string
    id: number,
    variants: VariantsWithImagesTags[]
}

const ActionCell = ({ row }: { row: Row<ProductColumn> }) => {
    const { execute } = useAction(deleteProduct, {
        onSuccess: ({ data }) => {
            toast.dismiss()
            if (data?.error) {
                toast.error(data.error)
            }
            if (data?.success) {
                toast.success(data.success)
            }
        },
        onExecute: () => {
            toast.loading("Deleting Product")
        },
        onError: () => {
            toast.dismiss()
        }
    })
    const product = row.original;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem className="dark:focus:bg-primary focus:bg-primary/50 cursor-pointer">
                    <Link href={`/dashboard/add-product?id=${product.id}`}>
                        Edit Product
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => execute({ id: product.id })}
                    className="dark:focus:bg-destructive focus:bg-destructive/50 cursor-pointer"
                >
                    Delete Product
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "id",
        header: "ID"
    },
    {
        accessorKey: "title",
        header: "Title"
    },
    {
        accessorKey: "variants",
        header: "Variants",
        cell: ({ row }) => {
            const variants = row.getValue("variants") as VariantsWithImagesTags[];

            return (
                <div className='flex gap-2'>
                    {
                        variants.map((variant) => (
                            <div key={variant.id}>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span>
                                                <ProductVariant editMode={true} productId={variant.id} variant={variant}>
                                                    <div
                                                        className="w-5 h-5 rounded-full"
                                                        key={variant.id}
                                                        style={{ background: variant.color }}
                                                    />
                                                </ProductVariant>

                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{variant.productType}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        ))
                    }

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span>
                                    <ProductVariant productId={row.original.id} editMode={false}>
                                        <PlusCircle className="h-5 w-5" />
                                    </ProductVariant>
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Create a new product variant</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>



                </div>

            )
        }
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"));
            const formatted = new Intl.NumberFormat("en-US", {
                currency: "USD",
                style: "currency"
            }).format(price)
            return (<div className='font-medium text-xs'>{formatted}</div>)
        }
    },

    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => {
            const cellImage = row.getValue("image") as string;
            const cellTitle = row.getValue("title") as string;
            return (<div>
                <Image
                    src={cellImage}
                    alt={cellTitle}
                    width={50}
                    height={50}
                    className='rounded-md'
                />
            </div>)
        }
    },
    {
        id: "actions",
        header: "Actions",
        cell: ActionCell,
    },
]