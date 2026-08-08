import { MEATS, site } from "@/content/site";
import { DAY_NAMES, weeklyStops } from "@/content/schedule";

/**
 * FoodEstablishment schema. This is how the truck shows up in
 * Google's local results and rich cards, which right now it
 * does not, because there has never been a website to crawl.
 */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    "@id": `${site.domain}/#business`,
    name: site.name,
    alternateName: "Cookin with Beans Taco Truck",
    description:
      "Mini street taco food truck based in Marshall, Michigan. Pollo and carne asada street tacos, available for catering and events.",
    url: site.domain,
    telephone: site.phone,
    email: site.email,
    servesCuisine: ["Mexican", "Tacos", "Street Food"],
    priceRange: "$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Marshall",
      addressRegion: "MI",
      postalCode: "49068",
      addressCountry: "US",
    },
    areaServed: site.serviceArea.map((a) => ({
      "@type": "Place",
      name: `${a}, Michigan`,
    })),
    sameAs: [site.facebook, site.instagram],
    openingHoursSpecification: weeklyStops.map((s) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${DAY_NAMES[s.day]}`,
      opens: s.start,
      closes: s.end,
    })),
    hasMenu: {
      "@type": "Menu",
      url: `${site.domain}/menu`,
      hasMenuSection: [
        {
          "@type": "MenuSection",
          name: "Street Tacos",
          hasMenuItem: MEATS.flatMap((m) => [
            {
              "@type": "MenuItem",
              name: `${m.label} Taco`,
              description: m.note,
              offers: {
                "@type": "Offer",
                price: m.single.toFixed(2),
                priceCurrency: "USD",
              },
            },
            {
              "@type": "MenuItem",
              name: `Three ${m.label} Tacos`,
              description: m.note,
              offers: {
                "@type": "Offer",
                price: m.triple.toFixed(2),
                priceCurrency: "USD",
              },
            },
          ]),
        },
      ],
    },
    makesOffer: {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Food truck catering",
        description:
          "Mobile taco catering for corporate lunches, weddings, festivals, and private events across Calhoun County, Michigan.",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
