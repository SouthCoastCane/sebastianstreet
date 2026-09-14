import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Inter, Anton } from "next/font/google";
import "./globals.css";
import { getSiteConfig } from "@/lib/siteConfig";

// Render per request so admin edits to content + branding appear immediately.
export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { branding } = await getSiteConfig();
  return {
    title: {
      default: branding.siteName,
      template: `%s - ${branding.siteName}`,
    },
    description:
      "Sebastian Street Studios - an independent studio making five shows. Live talk, long-form, from the road, and a documentary series. Watch here and on YouTube at the same time.",
    ...(branding.favicon ? { icons: { icon: branding.favicon } } : {}),
  };
}

// Is a hex color light? (perceived luminance) - used to pick readable text.
function isLightHex(hex: string): boolean {
  const m = /^#?([0-9a-f]{6})$/i.exec((hex || "").trim());
  if (!m) return false;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 140;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { branding } = await getSiteConfig();
  // Drive the whole design system off the saved accent/background/live colors.
  // --amber is the token the stylesheet actually uses everywhere.
  // Text colors follow the background: neutral (never warm/pinkish) on dark
  // backgrounds, and dark automatically when the client picks a light one.
  const light = isLightHex(branding.background);
  const text = light ? "#12100E" : "#F3EFE7";
  const mute = light ? "#5B615C" : "#BFC4C0";
  const dim = light ? "#7C827D" : "#8E938F";
  const themeVars = {
    "--amber": branding.accent,
    "--orange": branding.accent,
    "--accent": branding.accent,
    "--bg": branding.background,
    "--live": branding.live,
    "--text": text,
    "--ink": text,
    "--cream": text,
    "--mute": mute,
    "--text-muted": mute,
    "--text-dim": dim,
  } as CSSProperties;

  return (
    <html lang="en" className={`${inter.variable} ${anton.variable}`} style={themeVars}>
      <head>
        {/* Apply the saved light/dark theme before paint to avoid a flash. */}
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem('theme')==='light')document.documentElement.setAttribute('data-theme','light');}catch(e){}` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
