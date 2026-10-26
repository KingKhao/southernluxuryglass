import { redirect } from "next/navigation";
import { getSessionUsername } from "@/lib/session";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import { updateProduct } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await getSessionUsername())) redirect("/admin/login");
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: (await params).id } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!product) {
    notFound();
  }

  const boundUpdate = updateProduct.bind(null, product.id);

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-emerald">Edit Product</h1>
      <ProductForm
        action={boundUpdate}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        submitLabel="Save Changes"
        initialValues={{
          name: product.name,
          categoryId: product.categoryId,
          price: product.price,
          cost: product.cost,
          description: product.description,
          images: product.images,
          featured: product.featured,
          status: product.status,
          dimensions: product.dimensions,
          era: product.era,
          condition: product.condition,
          maker: product.maker,
        }}
      />
    </div>
  );
}
