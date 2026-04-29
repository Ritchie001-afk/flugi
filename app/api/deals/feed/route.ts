import { NextResponse } from "next/server";

import { getRecentDealFeed } from "@/lib/deal-feed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await getRecentDealFeed();

    return NextResponse.json({
      source: "flugi-deals-feed",
      version: 1,
      generatedAt: new Date().toISOString(),
      items,
    });
  } catch (error) {
    console.error("Failed to build deals feed:", error);
    return NextResponse.json({ error: "Failed to build deals feed" }, { status: 500 });
  }
}

