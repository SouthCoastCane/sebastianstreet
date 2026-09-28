"use client";

import { usePathname } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import type { Series } from "@/lib/siteData";

// The home (single no-scroll marquee) and the live page (self-contained
// player + chat) carry no footer. Every other page shows the full footer.
const NO_FOOTER = ["/", "/live"];

export default function ConditionalFooter({ brand, series }: { brand: { name: string; tagline: string }; series?: Series[] }) {
  const pathname = usePathname();
  if (NO_FOOTER.includes(pathname)) return null;
  return <SiteFooter brand={brand} series={series} />;
}
