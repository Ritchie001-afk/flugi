import prisma from "@/lib/db";
import { getDestinationImage } from "@/lib/images";
import { createHash } from "node:crypto";

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
  description: string;
  type: string;
  startDate: Date | null;
  endDate: Date | null;
  availableDates: string | null;
  transferCount: number | null;
  entryRequirements: string | null;
  tags: string[];
  originalPrice: number | null;
  externalId: string | null;
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

export type SocialAutopostDecision = "publish" | "manual_review";

export type SocialAutopostReasonCode =
  | "missing_price"
  | "missing_travel_window"
  | "missing_origin"
  | "multiple_stops"
  | "visa_or_transit_context"
  | "suspicious_discount"
  | "self_transfer";

export type SocialAutopostReason = {
  code: SocialAutopostReasonCode;
  message: string;
};

export type SocialAutopostItem = DealFeedItem & {
  dedupeKey: string;
  sourceItemId: string;
  payloadHash: string;
  travelWindowText: string | null;
  originText: string | null;
  hashtags: string[];
  facebookCaption: string;
  instagramCaption: string;
  publishingDecision: SocialAutopostDecision;
  manualReviewReasons: SocialAutopostReason[];
  make: {
    facebookMessage: string;
    instagramCaption: string;
    imageUrl: string;
    canonicalUrl: string;
  };
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

function slugifyTag(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .toLowerCase();
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

function formatTravelWindowText(deal: Pick<DealFeedRecord, "availableDates" | "startDate" | "endDate">): string | null {
  const availableDates = deal.availableDates?.trim();
  if (availableDates) return availableDates;

  if (deal.startDate && deal.endDate) {
    return `${deal.startDate.toLocaleDateString("cs-CZ")} - ${deal.endDate.toLocaleDateString("cs-CZ")}`;
  }

  if (deal.startDate) {
    return deal.startDate.toLocaleDateString("cs-CZ");
  }

  return null;
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

function buildShortHook(deal: Pick<DealFeedRecord, "type" | "transferCount" | "destination">): string {
  if (deal.type === "package") {
    return "Dobra cena na pohodovou dovolenou.";
  }

  if (deal.transferCount === 0) {
    return "Prima volba na rychly vylet.";
  }

  if (deal.transferCount && deal.transferCount > 0) {
    return "Zajimava cena na delsi cestu.";
  }

  return `Dobra cena smer ${deal.destination}.`;
}

function buildHashtags(deal: Pick<DealFeedRecord, "destination" | "startDate">): string[] {
  const destinationTag = slugifyTag(deal.destination);
  const hashtags = destinationTag ? [`#${destinationTag}`, "#cestovani"] : ["#cestovani"];

  if (!deal.startDate) {
    return hashtags.slice(0, 3);
  }

  const month = deal.startDate.getUTCMonth();
  const seasonTag =
    month >= 2 && month <= 4
      ? "#jaro"
      : month >= 5 && month <= 7
        ? "#leto"
        : month >= 8 && month <= 10
          ? "#podzim"
          : "#zima";

  return [...hashtags, seasonTag].slice(0, 3);
}

function buildFacebookCaption(deal: DealFeedRecord, feedItem: DealFeedItem, travelWindowText: string | null): string {
  const hook = buildShortHook(deal);
  const terminText = travelWindowText || "Termin upresnime v detailu dealu";

  return `${feedItem.routeText} od ${feedItem.priceText}. Termin ${terminText}. ${hook} Vice zde: ${feedItem.canonicalUrl}`;
}

function buildInstagramCaption(deal: DealFeedRecord, feedItem: DealFeedItem, travelWindowText: string | null, hashtags: string[]): string {
  const hook = buildShortHook(deal);
  const terminText = travelWindowText || "Termin upresnime v detailu dealu";

  return `${feedItem.destinationText} od ${feedItem.priceText}. Termin ${terminText}. ${hook} Detail letenky najdes na Lovci levnych letenek. ${hashtags.join(" ")}`.trim();
}

function getManualReviewReasons(deal: DealFeedRecord, travelWindowText: string | null): SocialAutopostReason[] {
  const reasons: SocialAutopostReason[] = [];

  if (!(deal.price > 0)) {
    reasons.push({
      code: "missing_price",
      message: "Chybi duveryhodna finalni cena.",
    });
  }

  if (!travelWindowText) {
    reasons.push({
      code: "missing_travel_window",
      message: "Chybi termin nebo jasne cestovni okno.",
    });
  }

  if (deal.type === "flight" && !deal.origin?.trim()) {
    reasons.push({
      code: "missing_origin",
      message: "Chybi jasne odletove letiste.",
    });
  }

  if (deal.type === "flight" && (deal.transferCount ?? 0) > 1) {
    reasons.push({
      code: "multiple_stops",
      message: "Let ma vice prestupu a patri do manualni kontroly.",
    });
  }

  const complianceText = `${deal.entryRequirements || ""} ${deal.description} ${deal.tags.join(" ")}`.toLowerCase();
  if (/\bvisa\b|\be-?ta\b|\besta\b|\btransit\b/.test(complianceText)) {
    reasons.push({
      code: "visa_or_transit_context",
      message: "Deal obsahuje visa nebo transit kontext pro rucni kontrolu copy.",
    });
  }

  if (/\bself[- ]?transfer\b|oddelen[ey]|separate tickets/.test(complianceText)) {
    reasons.push({
      code: "self_transfer",
      message: "Deal zminuje self-transfer nebo oddelene letenky.",
    });
  }

  if (deal.originalPrice && deal.originalPrice > 0 && deal.price / deal.originalPrice < 0.25) {
    reasons.push({
      code: "suspicious_discount",
      message: "Cena je vyrazne nizsi nez puvodni cena a ma jit do manualni kontroly.",
    });
  }

  return reasons;
}

function getPayloadHash(parts: Array<string | null | undefined>): string {
  const normalized = parts.map((part) => part || "").join("|");
  return createHash("sha256").update(normalized).digest("hex");
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

export function mapDealToSocialAutopostItem(deal: DealFeedRecord): SocialAutopostItem {
  const feedItem = mapDealToFeedItem(deal);
  const travelWindowText = formatTravelWindowText(deal);
  const hashtags = buildHashtags(deal);
  const manualReviewReasons = getManualReviewReasons(deal, travelWindowText);
  const facebookCaption = buildFacebookCaption(deal, feedItem, travelWindowText);
  const instagramCaption = buildInstagramCaption(deal, feedItem, travelWindowText, hashtags);
  const dedupeKey = deal.externalId?.trim() || feedItem.canonicalUrl;
  const payloadHash = getPayloadHash([
    dedupeKey,
    feedItem.updatedAt,
    feedItem.priceText,
    travelWindowText,
    feedItem.socialImageUrl,
    facebookCaption,
    instagramCaption,
  ]);

  return {
    ...feedItem,
    dedupeKey,
    sourceItemId: deal.externalId?.trim() || deal.id,
    payloadHash,
    travelWindowText,
    originText: deal.origin?.trim() || null,
    hashtags,
    facebookCaption,
    instagramCaption,
    publishingDecision: manualReviewReasons.length > 0 ? "manual_review" : "publish",
    manualReviewReasons,
    make: {
      facebookMessage: facebookCaption,
      instagramCaption,
      imageUrl: feedItem.socialImageUrl,
      canonicalUrl: feedItem.canonicalUrl,
    },
  };
}

async function getRecentDeals(limit = defaultFeedLimit): Promise<DealFeedRecord[]> {
  const now = new Date();
  return prisma.deal.findMany({
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
      description: true,
      type: true,
      startDate: true,
      endDate: true,
      availableDates: true,
      transferCount: true,
      entryRequirements: true,
      tags: true,
      originalPrice: true,
      externalId: true,
      datePublished: true,
      createdAt: true,
      updatedAt: true,
      expiresAt: true,
    },
  });
}

export async function getRecentDealFeed(limit = defaultFeedLimit): Promise<DealFeedItem[]> {
  const deals = await getRecentDeals(limit);

  return deals.map(mapDealToFeedItem);
}

export async function getRecentSocialAutopostFeed(limit = defaultFeedLimit): Promise<SocialAutopostItem[]> {
  const deals = await getRecentDeals(limit);

  return deals.map(mapDealToSocialAutopostItem);
}
