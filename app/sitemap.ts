import type { MetadataRoute } from "next";

import prisma from "@/lib/db";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.flugi.cz";

const staticRoutes = [
  "/",
  "/deals",
  "/zajezdy",
  "/pruvodce",
  "/magazin",
  "/kontakt",
  "/o-nas",
  "/pruvodce/skryte-letenky-hidden-city-ticketing",
  "/pruvodce/letiste-vaclava-havla-praha",
  "/pruvodce/letiste-brno-turany",
  "/pruvodce/letiste-leose-janacka-ostrava",
  "/pruvodce/letiste-viden-schwechat",
  "/pruvodce/letiste-krakov-balice",
  "/pruvodce/letiste-katovice-pyrzowice",
  "/pruvodce/letiste-bratislava-stefanik",
  "/magazin/proc-jsou-prekupnici-levnejsi",
  "/magazin/5-nejkrasnejsich-jezer-svycarska",
  "/magazin/rim-vecne-mesto-za-vikend",
  "/magazin/maledivy-raj-na-zemi-bez-cestovky",
  "/magazin/madeira-ostrov-vecneho-jara",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: new URL(path, baseUrl).toString(),
    lastModified: now,
    changeFrequency: path === "/" ? "hourly" : "weekly",
    priority:
      path === "/"
        ? 1
        : path === "/deals" || path === "/pruvodce" || path === "/magazin"
          ? 0.9
          : 0.7,
  }));

  try {
    const [deals, airports] = await Promise.all([
      prisma.deal.findMany({
        where: {
          OR: [{ expiresAt: { gt: now } }, { expiresAt: null }],
        },
        select: {
          slug: true,
          id: true,
          updatedAt: true,
          createdAt: true,
        },
      }),
      prisma.airport.findMany({
        select: {
          iata: true,
          updatedAt: true,
        },
      }),
    ]);

    entries.push(
      ...deals.map((deal) => ({
        url: new URL(`/deal/${deal.slug || deal.id}`, baseUrl).toString(),
        lastModified: deal.updatedAt || deal.createdAt,
        changeFrequency: "daily" as const,
        priority: 0.8,
      }))
    );

    entries.push(
      ...airports.map((airport) => ({
        url: new URL(`/letiste/${airport.iata.toLowerCase()}`, baseUrl).toString(),
        lastModified: airport.updatedAt || now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
    );
  } catch (error) {
    console.error("Failed to build dynamic sitemap entries:", error);
  }

  return entries;
}
