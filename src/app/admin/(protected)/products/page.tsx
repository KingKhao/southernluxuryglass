import { redirect } from "next/navigation";
import { getSessionUsername } from "@/lib/session";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteProduct, toggleFeatured } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  if (!(await getSessionUsername())) redirect("/admin/login");
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl text-emerald">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-emerald px-5 py-2 text-sm text-cream hover:bg-emerald-dark"
        >
          + Add Product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-emerald/15 bg-white/60">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-emerald/15 text-charcoal/60">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Cost</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-emerald/10 last:border-0">
                <td className="px-4 py-3 font-medium text-charcoal">{product.name}</td>
                <td className="px-4 py-3 text-charcoal/70">{product.category.name}</td>
                <td className="px-4 py-3 text-charcoal/70">${product.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-charcoal/50">
                  {product.cost != null ? `$${product.cost.toFixed(2)}` : "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={[
                      "rounded-full px-3 py-1 text-xs",
                      product.status === "SOLD"
                        ? "bg-charcoal/10 text-charcoal/60"
                        : product.status === "RESERVED"
                        ? "bg-gold/20 text-gold"
                        : "bg-emerald/10 text-emerald",
                    ].join(" ")}
                  >
                    {product.status === "SOLD" ? "Sold" : product.status === "RESERVED" ? "Reserved" : "Available"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <form action={toggleFeatured.bind(null, product.id, !product.featured)}>
                    <button
                      type="submit"
                      className={[
                        "rounded-full px-3 py-1 text-xs",
                        product.featured
                          ? "bg-gold/20 text-gold"
                          : "bg-charcoal/10 text-charcoal/50",
                      ].join(" ")}
                    >
                      {product.featured ? "Featured" : "Not featured"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-emerald hover:underline"
                    >
                      Edit
                    </Link>
                    <form action={deleteProduct.bind(null, product.id)}>
                      <button type="submit" className="text-red-700 hover:underline">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-charcoal/60">
                  No products yet. Add your first piece above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
