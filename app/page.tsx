import Algolia from "@/components/products/algolia";
import ProductTags from "@/components/products/product-tags";
import Products from "@/components/products/products";
import { db } from "@/server";
export const revalidate = 60 * 60
export default async function Home() {
  const products = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true
    }
  })

  return (
    <main className="">
      <ProductTags />
      <Algolia />
      <Products variants={products} />
    </main>
  );


}
