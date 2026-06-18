import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getAllSchemes, getAllCertificates } from "@/lib/data";

/**
 * Dynamic sitemap: static marketing/legal routes plus a detail entry for every
 * scheme and certificate. URLs are absolute (resolved against SITE.url).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const abs = (path: string) => new URL(path, SITE.url).toString();

  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { path: "/", changeFrequency: "daily", priority: 1.0 },
      { path: "/explore", changeFrequency: "daily", priority: 0.9 },
      { path: "/certificates", changeFrequency: "weekly", priority: 0.8 },
      { path: "/how-it-works", changeFrequency: "monthly", priority: 0.7 },
      { path: "/about", changeFrequency: "monthly", priority: 0.5 },
      { path: "/faq", changeFrequency: "monthly", priority: 0.5 },
      { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
      { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
    ] as const
  ).map((r) => ({
    url: abs(r.path),
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const [schemes, certificates] = await Promise.all([
    getAllSchemes(),
    getAllCertificates(),
  ]);

  const schemeRoutes: MetadataRoute.Sitemap = schemes.map((s) => ({
    url: abs(`/explore/${s.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const certificateRoutes: MetadataRoute.Sitemap = certificates.map((c) => ({
    url: abs(`/certificates/${c.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...schemeRoutes, ...certificateRoutes];
}
