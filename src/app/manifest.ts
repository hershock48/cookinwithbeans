import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/**
 * Web app manifest. The reason to bother: people who find a food truck on their
 * phone often want it one tap away, and "Add to Home Screen" without a manifest
 * gives them a screenshot with a grey label. With one it gives them the skull.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.tagline}`,
    short_name: site.name,
    description: site.blurb,
    start_url: "/",
    display: "standalone",
    background_color: "#fff6ea",
    theme_color: "#4bc6d2",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      // Android crops maskable icons to its own shape, so this one is drawn
      // with the mark pulled into the safe zone.
      {
        src: "/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
