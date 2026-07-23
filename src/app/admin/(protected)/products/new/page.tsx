import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import { createProduct } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-emerald">Add Product</h1>
      <ProductForm
        action={createProduct}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        submitLabel="Create Product"
      />
    </div>
  );
}
