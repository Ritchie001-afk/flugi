import { NextRequest, NextResponse } from "next/server";

import { getRecentSocialAutopostFeed } from "@/lib/deal-feed";

export const dynamic = "force-dynamic";

function getLimit(request: NextRequest): number {
  const rawLimit = request.nextUrl.searchParams.get("limit");
  const parsed = rawLimit ? Number.parseInt(rawLimit, 10) : NaN;

  if (!Number.isFinite(parsed)) return 25;

  return Math.min(Math.max(parsed, 1), 100);
}

export async function GET(request: NextRequest) {
  try {
    const limit = getLimit(request);
    const items = await getRecentSocialAutopostFeed(limit);

    return NextResponse.json({
      source: "flugi-social-autopost-feed",
      version: 1,
      generatedAt: new Date().toISOString(),
      defaults: {
        dedupeKey: "dedupeKey",
        facebookField: "make.facebookMessage",
        instagramField: "make.instagramCaption",
        imageField: "make.imageUrl",
      },
      items,
    });
  } catch (error) {
    console.error("Failed to build social autopost feed:", error);
    return NextResponse.json({ error: "Failed to build social autopost feed" }, { status: 500 });
  }
}
