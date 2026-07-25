import Link from "next/link";
import { prisma } from "@/lib/prisma";
import InquiriesList from "@/components/admin/InquiriesList";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const TABS = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "working", label: "Working Lead" },
  { key: "serious", label: "Serious Buyers" },
] as const;

const FILTER_STATUS: Record<string, Prisma.InquiryWhereInput> = {
  new: { status: "NEW" },
  working: { status: "WORKING_LEAD" },
  serious: { status: "SERIOUS_BUYER" },
};

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: { filter?: string };
}) {
  const filter =
    searchParams.filter && FILTER_STATUS[searchParams.filter] ? searchParams.filter : "all";

  const where: Prisma.InquiryWhereInput = FILTER_STATUS[filter] ?? {};

  const inquiries = await prisma.inquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-2 font-serif text-2xl text-emerald">Inquiries</h1>
      <p className="mb-4 text-sm text-charcoal/60">
        Messages sent through the inquiry and Contact Me forms. Label serious buyers to keep
        your best leads handy.
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const active = filter === tab.key || (tab.key === "all" && filter === "all");
          return (
            <Link
              key={tab.key}
              href={tab.key === "all" ? "/admin/inquiries" : `/admin/inquiries?filter=${tab.key}`}
              className={[
                "rounded-full border px-4 py-1.5 text-sm transition-colors",
                active
                  ? "border-emerald bg-emerald text-cream"
                  : "border-emerald/30 text-emerald hover:bg-emerald/10",
              ].join(" ")}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <InquiriesList
        inquiries={inquiries.map((i) => ({
          id: i.id,
          productName: i.productName,
          name: i.name,
          phone: i.phone,
          email: i.email,
          message: i.message,
          status: i.status,
          createdAt: i.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
