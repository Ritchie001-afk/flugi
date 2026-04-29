import prisma from "@/lib/db";
import { getDestinationImage } from "@/lib/images";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.flugi.cz";
const defaultFeedLimit = 25;

type DealFeedRecord = {
  id: string;
  slug: string;
  title: string;
  destination: string;
  price: number;
  currency: string;
  image: string;
  ogImage: string | null;
  origin: string | null;
  type: string;
  datePublished: Date | null;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date | null;
};

export type DealFeedItem = {
  id: string;
  slug: string;
  canonicalUrl: string;
  title: string;
  publishedAt: string;
  updatedAt: string;
  destinationText: string;
  routeText: string;
  priceText: string;
  imageUrl: string;
  socialImageUrl: string;
  dealType: string;
};

function toAbsoluteUrl(value: string | null | undefined): string | null {
  if (!value) return null;

  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return null;
  }
}

function getCanonicalUrl(slug: string, id: string): string {
  return new URL(`/deal/${slug || id}`, baseUrl).toString();
}

function formatPriceText(price: number, currency: string): string {
  const normalizedCurrency = currency || "CZK";

  try {
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: normalizedCurrency,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${Math.round(price)} ${normalizedCurrency}`;
  }
}

function getRouteText(deal: Pick<DealFeedRecord, "origin" | "destination">): string {
  const origin = deal.origin?.trim();
  const destination = deal.destination.trim();

  return origin ? `${origin} -> ${destination}` : destination;
}

function getPrimaryImageUrl(deal: DealFeedRecord): string {
  const absoluteOgImage = toAbsoluteUrl(deal.ogImage);
  if (absoluteOgImage) return absoluteOgImage;

  const absoluteImage = toAbsoluteUrl(deal.image);
  if (absoluteImage) return absoluteImage;

  const fallbackImage = getDestinationImage(deal.destination, deal.image);
  const absoluteFallback = toAbsoluteUrl(fallbackImage);
  if (absoluteFallback) return absoluteFallback;

  return new URL("/api/og.png", baseUrl).toString();
}

function getSocialImageUrl(deal: DealFeedRecord): string {
  return new URL(`/api/og.png?slug=${encodeURIComponent(deal.slug || deal.id)}`, baseUrl).toString();
}

export function mapDealToFeedItem(deal: DealFeedRecord): DealFeedItem {
  const publishedAt = deal.datePublished || deal.createdAt;

  return {
    id: deal.id,
    slug: deal.slug,
    canonicalUrl: getCanonicalUrl(deal.slug, deal.id),
    title: deal.title,
    publishedAt: publishedAt.toISOString(),
    updatedAt: deal.updatedAt.toISOString(),
    destinationText: deal.destination,
    routeText: getRouteText(deal),
    priceText: formatPriceText(deal.price, deal.currency),
    imageUrl: getPrimaryImageUrl(deal),
    socialImageUrl: getSocialImageUrl(deal),
    dealType: deal.type,
  };
}

export async function getRecentDealFeed(limit = defaultFeedLimit): Promise<DealFeedItem[]> {
  const now = new Date();
  const deals = await prisma.deal.findMany({
    where: {
      OR: [{ expiresAt: { gt: now } }, { expiresAt: null }],
    },
    orderBy: [
      { datePublished: "desc" },
      { createdAt: "desc" },
    ],
    take: limit,
    select: {
      id: true,
      slug: true,
      title: true,
      destination: true,
      price: true,
      currency: true,
      image: true,
      ogImage: true,
      origin: true,
      type: true,
      datePublished: true,
      createdAt: true,
      updatedAt: true,
      expiresAt: true,
    },
  });

  return deals.map(mapDealToFeedItem);
}

