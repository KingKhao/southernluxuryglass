import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export type SocialLink = { url: string; enabled: boolean };
export type EmailLink = { address: string; enabled: boolean };

export type SocialSetting = {
  instagram: SocialLink;
  tiktok: SocialLink;
  pinterest: SocialLink;
  linkedin: SocialLink;
  whatnot: SocialLink;
  email: EmailLink;
};

export type HomeContentSetting = {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  missionStatement: string;
  aboutHeading: string;
  aboutText: string;
  aboutImageUrl: string;
};

export type SettingsShape = {
  home: HomeContentSetting;
  social: SocialSetting;
};

export const SETTINGS_DEFAULTS: SettingsShape = {
  home: {
    heroEyebrow: "Southern Luxury Glass",
    heroTitle: "Antique & Vintage Glassware, Rediscovered",
    heroSubtitle:
      "One-of-a-kind pieces with history, character, and Southern charm — handpicked and lovingly restored to their rightful shine.",
    missionStatement:
      "Every piece tells a story — my mission is to help you find the pieces that become part of yours.",
    aboutHeading: "About Crystal Brisbois",
    aboutText:
      "My love for beautiful things started long before Southern Luxury Glass became a reality. I believe every piece tells a story — and my mission is to help you find the pieces that become part of yours.",
    aboutImageUrl: "/crystal-home.png",
  },
  social: {
    instagram: { url: "", enabled: false },
    tiktok: { url: "", enabled: false },
    pinterest: { url: "", enabled: false },
    linkedin: { url: "", enabled: false },
    whatnot: { url: "", enabled: false },
    email: { address: "", enabled: false },
  },
};

export type SettingKey = keyof SettingsShape;

// Accepts both the old string format ("https://…") and the new {url, enabled}
// object format, so settings saved before toggles existed still work.
function toLink(value: unknown): SocialLink {
  if (typeof value === "string") return { url: value, enabled: value.trim() !== "" };
  if (value && typeof value === "object") {
    const v = value as Record<string, unknown>;
    return { url: String(v.url ?? ""), enabled: Boolean(v.enabled) };
  }
  return { url: "", enabled: false };
}

function toEmailLink(value: unknown): EmailLink {
  if (typeof value === "string") return { address: value, enabled: value.trim() !== "" };
  if (value && typeof value === "object") {
    const v = value as Record<string, unknown>;
    return { address: String(v.address ?? ""), enabled: Boolean(v.enabled) };
  }
  return { address: "", enabled: false };
}

function normalizeSocial(stored: unknown): SocialSetting {
  const s = (stored ?? {}) as Record<string, unknown>;
  return {
    instagram: toLink(s.instagram),
    tiktok: toLink(s.tiktok),
    pinterest: toLink(s.pinterest),
    linkedin: toLink(s.linkedin),
    whatnot: toLink(s.whatnot),
    email: toEmailLink(s.email),
  };
}

export async function getSettings(): Promise<SettingsShape> {
  const rows = await prisma.setting.findMany();
  const map = new Map(rows.map((r) => [r.key, r.value]));

  return {
    home: { ...SETTINGS_DEFAULTS.home, ...(map.get("home") as object | undefined) },
    social: normalizeSocial(map.get("social")),
  };
}

export async function setSetting<K extends SettingKey>(key: K, value: SettingsShape[K]) {
  const jsonValue = value === null ? Prisma.JsonNull : (value as object);
  await prisma.setting.upsert({
    where: { key },
    update: { value: jsonValue },
    create: { key, value: jsonValue },
  });
}
