import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: { path: string; priority: number; freq: "daily" | "weekly" | "monthly" }[] = [
    { path: "", priority: 1, freq: "daily" },
    { path: "/schedule", priority: 0.95, freq: "daily" },
    { path: "/menu", priority: 0.8, freq: "monthly" },
    { path: "/order", priority: 0.8, freq: "monthly" },
    { path: "/catering", priority: 0.9, freq: "monthly" },
    { path: "/about", priority: 0.5, freq: "monthly" },
    { path: "/contact", priority: 0.6, freq: "monthly" },
  ];

  return routes.map((r) => ({
    url: `${site.domain}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}
