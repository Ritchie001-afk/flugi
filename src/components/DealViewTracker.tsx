"use client";

import { useEffect } from "react";

import { trackEvent } from "@/lib/analytics";

type DealViewTrackerProps = {
  slug: string;
  title: string;
  dealType?: string | null;
  price?: number | null;
  destination?: string | null;
};

export function DealViewTracker({
  slug,
  title,
  dealType,
  price,
  destination,
}: DealViewTrackerProps) {
  useEffect(() => {
    trackEvent("deal_detail_view", {
      deal_slug: slug,
      deal_title: title,
      deal_type: dealType || undefined,
      deal_price: price || undefined,
      destination: destination || undefined,
    });
  }, [dealType, destination, price, slug, title]);

  return null;
}
