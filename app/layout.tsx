import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { getSiteContact, SITE } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Hawk Motors | Used Cars Leicester",
    template: "%s | Hawk Motors",
  },
  description: "Hawk Motors — Leicester's used car dealer. Quality handpicked used cars at competitive prices. No pressure, fast process. Call 07514552586.",
  openGraph: {
    type: "website",
    siteName: "Hawk Motors",
    images: ["/logo.svg"],
  },
  icons: { icon: "/icon.svg", apple: "/logo.png" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const contact = await getSiteContact();
  const accentStyle = {
    // Admin-configured accent overrides the CSS default at runtime.
    ["--accent" as string]: `${contact.accent.r} ${contact.accent.g} ${contact.accent.b}`,
  } as React.CSSProperties;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: "Hawk Motors",
    description: "Leicester's premium used car dealer. Quality used cars at competitive prices.",
    url: "https://hawk-motors.co.uk",
    telephone: "07514552586",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Leicester",
      addressRegion: "Leicestershire",
      addressCountry: "GB",
    },
    areaServed: ["Leicester", "Leicestershire", "East Midlands"],
    openingHours: "By appointment",
  };

  return (
    <html lang="en-GB" suppressHydrationWarning>
      <body className={`${inter.variable} ${oswald.variable} bg-field min-h-screen font-sans`} style={accentStyle}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
