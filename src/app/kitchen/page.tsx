import type { Metadata } from "next";
import KitchenClient from "@/components/ordering/KitchenClient";
import { loadMenuDoc, toOrderable } from "@/lib/ordering/menu";
import { getStore } from "@/lib/ordering/store";

// The truck's board: orders, 86s, busy dial, menu editor. PIN gated,
// noindex, lives on the owner's phone. Ported from the Copper AC build.
export const metadata: Metadata = {
  title: "Kitchen",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function KitchenPage() {
  const sections = toOrderable(await loadMenuDoc(getStore()), { includeHidden: true });
  return (
    <div className="min-h-screen bg-neutral-950 px-5 py-10">
      <div className="mx-auto max-w-5xl">
        <KitchenClient sections={sections} />
      </div>
    </div>
  );
}
