import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUsername } from "@/lib/session";

function csvCell(value: string): string {
  // Neutralize formula injection (CWE-1236): a cell whose content — even
  // quoted — starts with =, +, -, or @ is still executed as a formula by
  // Excel/Sheets. These values come from public, unauthenticated form
  // submissions, so this isn't optional. Prefixing with a plain quote
  // forces it to be read as literal text instead.
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  // Always quote; escape embedded quotes by doubling them.
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET() {
  if (!(await getSessionUsername())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const contacts = await prisma.contact.findMany({
    orderBy: { name: "asc" },
    include: { history: { orderBy: { createdAt: "asc" } } },
  });

  const header = ["Name", "Email", "Phone", "Label", "SMS OK?", "Inquiry History"];
  const rows = contacts.map((c) => {
    const history = c.history
      .map((h) => {
        const date = h.createdAt.toISOString().slice(0, 10);
        const detail = h.detail ? ` — ${h.detail}` : "";
        return `[${date}] ${h.summary}${detail}`;
      })
      .join(" | ");
    const smsOk = c.smsConsent ? "Yes" : "No";
    return [c.name, c.email, c.phone, c.category, smsOk, history].map(csvCell).join(",");
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
