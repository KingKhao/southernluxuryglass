import type { MetadataRoute } from "next";

const BASE_URL = "https://southernluxuryglass.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/gallery", "/about", "/privacy", "/terms", "/accessibility"];
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));
}
