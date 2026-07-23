import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [productCount, featuredCount, eventCount] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { featured: true } }),
    prisma.event.count({ where: { date: { gte: new Date() } } }),
  ]);

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-emerald">Overview</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/products"
          className="rounded-lg border border-emerald/15 bg-white/60 p-6 transition-shadow hover:shadow-md"
        >
          <p className="text-3xl font-semibold text-emerald">{productCount}</p>
          <p className="text-sm text-charcoal/60">Total products</p>
        </Link>
        <div className="rounded-lg border border-emerald/15 bg-white/60 p-6">
          <p className="text-3xl font-semibold text-emerald">{featuredCount}</p>
          <p className="text-sm text-charcoal/60">Featured on homepage (max 3)</p>
        </div>
        <Link
          href="/admin/events"
          className="rounded-lg border border-emerald/15 bg-white/60 p-6 transition-shadow hover:shadow-md"
        >
          <p className="text-3xl font-semibold text-emerald">{eventCount}</p>
          <p className="text-sm text-charcoal/60">Upcoming live shows</p>
        </Link>
      </div>
    </div>
  );
}
