import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const vehicles = await prisma.vehicle.findMany({
    where: { status: { not: "DRAFT" } },
    select: { slug: true, updatedAt: true },
  }).catch(() => []);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/inventory`, changeFrequency: "hourly", priority: 0.9 },
  ];

  const vehicleRoutes: MetadataRoute.Sitemap = vehicles.map((v) => ({
    url: `${SITE.url}/vehicles/${v.slug}`,
    lastModified: v.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...vehicleRoutes];
}
