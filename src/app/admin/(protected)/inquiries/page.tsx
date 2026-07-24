import { prisma } from "@/lib/prisma";
import InquiriesList from "@/components/admin/InquiriesList";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-2 font-serif text-2xl text-emerald">Inquiries</h1>
      <p className="mb-6 text-sm text-charcoal/60">
        Messages sent through the &ldquo;Inquire About This Piece&rdquo; form. Deleting one
        requires your PIN.
      </p>
      <InquiriesList
        inquiries={inquiries.map((i) => ({
          id: i.id,
          productName: i.productName,
          name: i.name,
          phone: i.phone,
          email: i.email,
          message: i.message,
          createdAt: i.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
