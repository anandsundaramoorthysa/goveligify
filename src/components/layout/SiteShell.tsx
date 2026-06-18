"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/**
 * Renders the marketing chrome (Header + Footer) for normal routes, but renders
 * children full-bleed on /chat so the assistant can be a 100dvh immersive page
 * with its own slim header.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const fullScreen = pathname === "/chat" || pathname.startsWith("/chat/");

  // /chat: keep the site nav on top, then let the assistant fill the viewport.
  if (fullScreen) {
    return (
      <div className="flex h-[100dvh] flex-col">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main" className="min-h-0 flex-1">
          {children}
        </main>
      </div>
    );
  }

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
