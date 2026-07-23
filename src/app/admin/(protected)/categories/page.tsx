import { prisma } from "@/lib/prisma";
import CategoriesTable from "@/components/admin/CategoriesTable";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-emerald">Categories</h1>
      <CategoriesTable
        initialCategories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          sortOrder: c.sortOrder,
          productCount: c._count.products,
        }))}
      />
    </div>
  );
}
