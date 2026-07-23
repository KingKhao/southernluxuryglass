import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import { updateProduct } from "../actions";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });

  if (!product) {
    notFound();
  }

  const boundUpdate = updateProduct.bind(null, product.id);

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-emerald">Edit Product</h1>
      <ProductForm
        action={boundUpdate}
        submitLabel="Save Changes"
        initialValues={{
          name: product.name,
          category: product.category,
          price: product.price,
          description: product.description,
          imageUrl: product.imageUrl,
          featured: product.featured,
        }}
      />
    </div>
  );
}
