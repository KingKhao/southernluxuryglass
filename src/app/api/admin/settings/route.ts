import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSettings, setSetting, type SettingKey } from "@/lib/settings";
import { getSessionUsername } from "@/lib/session";

const KEYS: SettingKey[] = ["home", "social", "about"];

export async function GET() {
  if (!(await getSessionUsername())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  if (!(await getSessionUsername())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const body = await req.json();

  for (const key of KEYS) {
    if (body[key] !== undefined) {
      await setSetting(key, body[key]);
    }
  }

  // Home/About now use time-based revalidation instead of force-dynamic, so
  // a settings edit needs an explicit on-demand revalidation to show up
  // immediately rather than waiting out the cache window.
  revalidatePath("/");
  revalidatePath("/about");

  const settings = await getSettings();
  return NextResponse.json(settings);
}
