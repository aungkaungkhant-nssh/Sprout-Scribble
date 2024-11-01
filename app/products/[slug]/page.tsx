import AddCart from "@/components/cart/add-cart"
import ProductPick from "@/components/products/product-pick"
import ProductShowCase from "@/components/products/product-showcase"
import ProductType from "@/components/products/productType"
import Reviews from "@/components/reviews/reviews"
import Stars from "@/components/reviews/stars"
import { Separator } from "@/components/ui/separator"
import formatPrice from "@/lib/format-price"
import { getReviewAverage } from "@/lib/review-average"
import { db } from "@/server"
import { productVariants } from "@/server/schema"
import { eq } from "drizzle-orm"

export default async function Page({ params }: { params: { slug: string } }) {

    const variant = await db.query.productVariants.findFirst({
        where: eq(productVariants.id, Number(params.slug)),
        with: {
            product: {
                with: {
                    reviews: true,
                    productVariants: {
                        with: { variantImages: true, variantTags: true },
                    },
                },
            },
        },
    })

    if (variant) {
        const reviewAvg = getReviewAverage(
            variant.product?.reviews.map((review) => review.rating)
        )
        return (
            <main>
                <section className="flex flex-col lg:flex-row gap-4 lg:gap-12">
                    <div className="flex-1">
                        <ProductShowCase variants={variant.product.productVariants} />
                    </div>
                    <div className="flex flex-col flex-1">
                        <h2 className="text-2xl font-bold">{variant?.product.title}</h2>
                        <div>
                            <ProductType variants={variant?.product.productVariants} />
                            <Stars
                                rating={reviewAvg}
                                totalReviews={variant.product.reviews.length}
                            />
                        </div>
                        <Separator className="my-2" />
                        <p className="text-2xl font-medium py-2">
                            {formatPrice(variant.product.price)}
                        </p>
                        <div
                            dangerouslySetInnerHTML={{ __html: variant.product.description }}
                        ></div>
                        <p className="text-secondary-foreground font-medium my-2">
                            Available Colors
                        </p>
                        <div className="flex gap-4">
                            {variant.product.productVariants.map((prodVariant) => (
                                <ProductPick
                                    key={prodVariant.id}
                                    productId={variant.productId}
                                    productType={prodVariant.productType}
                                    id={prodVariant.id}
                                    color={prodVariant.color}
                                    price={variant.product.price}
                                    title={variant.product.title}
                                    image={prodVariant.variantImages[0].url}
                                />
                            ))}
                        </div>
                        <AddCart />
                    </div>
                </section>
                <Reviews productId={variant.productId} />
            </main>
        )
    }

}