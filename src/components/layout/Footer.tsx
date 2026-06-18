import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/layout/Container";
import { SITE, FOOTER_NAV } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear(); // server component — resolved at build/render
  return (
    <footer className="mt-24 border-t border-surface-muted bg-surface-card">
      <div className="tricolor-rule" aria-hidden />
      <Container className="grid grid-cols-2 gap-8 py-12 sm:grid-cols-3 lg:grid-cols-5">
        <div className="col-span-2 lg:col-span-2">
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-ink-muted">{SITE.tagline}</p>
          <p className="mt-4 max-w-sm text-xs leading-relaxed text-ink-faint">
            {SITE.disclaimer}
          </p>
        </div>

        {FOOTER_NAV.map((col) => (
          <div key={col.title}>
            <h2 className="font-display text-sm font-semibold text-ink">{col.title}</h2>
            <ul className="mt-3 space-y-2">
              {col.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ink-muted transition-colors hover:text-navy"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-surface-muted">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-xs text-ink-faint sm:flex-row">
          <p>
            &copy; {year} {SITE.name}. An independent, non-government service.
          </p>
          <p>{SITE.url.replace("https://", "")}</p>
        </Container>
      </div>
    </footer>
  );
}
