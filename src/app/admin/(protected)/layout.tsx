import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-emerald/15 pb-5">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-serif text-xl text-emerald">
            Admin Dashboard
          </Link>
          <nav className="flex gap-4 text-sm text-charcoal/70">
            <Link href="/admin/settings" className="hover:text-emerald">
              Homepage
            </Link>
            <Link href="/admin/categories" className="hover:text-emerald">
              Categories
            </Link>
            <Link href="/admin/products" className="hover:text-emerald">
              Products
            </Link>
            <Link href="/admin/events" className="hover:text-emerald">
              Live Shows
            </Link>
            <Link href="/admin/inquiries" className="hover:text-emerald">
              Inquiries
            </Link>
          </nav>
        </div>
        <LogoutButton />
      </div>
      {children}
    </div>
  );
}
