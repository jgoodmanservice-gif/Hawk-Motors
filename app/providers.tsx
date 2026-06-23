"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} value={{ dark: "dark", light: "light" }}>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
