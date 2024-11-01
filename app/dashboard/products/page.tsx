import { db } from "@/server"
import placeholder from '@/public/placeholder_small.jpg'
import { DataTable } from "./data-table";
import { columns } from "./column";
export default async function Products() {
    const products = await db.query.products.findMany({
        with: {
            productVariants: { with: { variantImages: true, variantTags: true } }
        }
    })
    if (!products) throw new Error("No products not found");
    const dataTable = products.map((product) => {
        if (product.productVariants.length === 0) {
            return {
                id: product.id,
                title: product.title,
                price: product.price,
                variants: [],
                image: placeholder.src
            }
        }

        const image = product.productVariants[0].variantImages[0].url;
        return {
            id: product.id,
            title: product.title,
            price: product.price,
            variants: product.productVariants,
            image
        }

    })
    return (
        <div>
            <DataTable columns={columns} data={dataTable} />
        </div>
    )
}