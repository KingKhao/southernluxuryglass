import { NextRequest, NextResponse } from "next/server";
import { getSettings, setSetting, type SettingKey } from "@/lib/settings";
import { getSessionUsername } from "@/lib/session";

const KEYS: SettingKey[] = ["home", "social"];

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

  const settings = await getSettings();
  return NextResponse.json(settings);
}
