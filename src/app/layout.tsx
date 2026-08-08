import type { Metadata } from "next";
import { Anton, Archivo } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StructuredData } from "@/components/StructuredData";
import { site } from "@/content/site";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `${site.name} | Mini Street Taco Food Truck in Marshall, MI`,
    template: `%s | ${site.name}`,
  },
  description:
    "Mini street taco food truck based in Marshall, Michigan. See where the truck is parked today, browse the menu, and book us for catering and events across Calhoun County.",
  keywords: [
    "taco truck Marshall MI",
    "food truck Battle Creek",
    "street tacos Michigan",
    "food truck catering Calhoun County",
    "Cookin with Beans",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.domain,
    siteName: site.name,
    title: `${site.name} | Mini Street Taco Food Truck`,
    description:
      "Find out where the truck is parked today. Pollo and carne asada street tacos in Marshall, Battle Creek, and beyond.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | Mini Street Taco Food Truck`,
    description: "Where is the truck today? Find out here.",
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#4BC6D2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${archivo.variable} h-full`}>
      <body className="flex min-h-full flex-col font-sans">
        <StructuredData />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-3 focus:font-display focus:uppercase focus:text-lime"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
