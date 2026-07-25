import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUsername } from "@/lib/session";

function csvCell(value: string): string {
  // Always quote; escape embedded quotes by doubling them.
  return `"${value.replace(/"/g, '""')}"`;
}

export async function GET() {
  if (!(await getSessionUsername())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const contacts = await prisma.contact.findMany({
    orderBy: { name: "asc" },
    include: { history: { orderBy: { createdAt: "asc" } } },
  });

  const header = ["Name", "Email", "Phone", "Label", "Inquiry History"];
  const rows = contacts.map((c) => {
    const history = c.history
      .map((h) => {
        const date = h.createdAt.toISOString().slice(0, 10);
        const detail = h.detail ? ` — ${h.detail}` : "";
        return `[${date}] ${h.summary}${detail}`;
      })
      .join(" | ");
    return [c.name, c.email, c.phone, c.category, history].map(csvCell).join(",");
  });

  const csv = [header.map(csvCell).join(","), ...rows].join("\r\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="contacts.csv"',
    },
  });
}
