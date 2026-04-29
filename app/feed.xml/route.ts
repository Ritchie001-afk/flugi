import { getRecentDealFeed } from "@/lib/deal-feed";

export const dynamic = "force-dynamic";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  try {
    const items = await getRecentDealFeed();
    const now = new Date().toUTCString();

    const rssItems = items
      .map(
        (item) => `    <item>
      <guid isPermaLink="false">${escapeXml(item.id)}</guid>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.canonicalUrl)}</link>
      <pubDate>${new Date(item.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(`${item.routeText} | ${item.priceText}`)}</description>
      <enclosure url="${escapeXml(item.socialImageUrl)}" type="image/png" />
    </item>`
      )
      .join("\n");

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Flugi - nove deals</title>
    <link>https://www.flugi.cz/feed.xml</link>
    <description>Stabilni feed nove publikovanych dealu pro social automation.</description>
    <language>cs-CZ</language>
    <lastBuildDate>${now}</lastBuildDate>
${rssItems}
  </channel>
</rss>`;

    return new Response(body, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Failed to build RSS feed:", error);
    return new Response("Failed to build RSS feed", { status: 500 });
  }
}
