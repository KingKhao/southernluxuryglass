import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export type SocialLinksSetting = {
  instagram: string;
  linkedin: string;
  pinterest: string;
  whatnot: string;
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
  social: SocialLinksSetting;
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
    instagram: "",
    linkedin: "",
    pinterest: "",
    whatnot: "",
  },
};

export type SettingKey = keyof SettingsShape;

export async function getSettings(): Promise<SettingsShape> {
  const rows = await prisma.setting.findMany();
  const map = new Map(rows.map((r) => [r.key, r.value]));

  return {
    home: { ...SETTINGS_DEFAULTS.home, ...(map.get("home") as object | undefined) },
    social: { ...SETTINGS_DEFAULTS.social, ...(map.get("social") as object | undefined) },
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
