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
    default: "Hawk Motors | Premium Used Cars",
    template: "%s | Hawk Motors",
  },
  description:
    "Hawk Motors — premium used cars. Browse our handpicked inventory of luxury and performance vehicles. Instant valuation, competitive offers, fast & easy process.",
  openGraph: {
    type: "website",
    siteName: "Hawk Motors",
    images: ["/logo.svg"],
  },
  icons: { icon: "/icon.svg" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const contact = await getSiteContact();
  const accentStyle = {
    // Admin-configured accent overrides the CSS default at runtime.
    ["--accent" as string]: `${contact.accent.r} ${contact.accent.g} ${contact.accent.b}`,
  } as React.CSSProperties;

  return (
    <html lang="en-GB" suppressHydrationWarning>
      <body className={`${inter.variable} ${oswald.variable} bg-field min-h-screen font-sans`} style={accentStyle}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
