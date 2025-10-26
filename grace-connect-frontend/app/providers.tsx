"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system">
      <HeroUIProvider  style={{ backgroundColor: '#1a1a1a', color: 'white' }}>{children}</HeroUIProvider>
    </NextThemesProvider>
  );
}