"use client";

import type { ComponentPropsWithoutRef, MouseEvent } from "react";

import { trackEvent } from "@/lib/analytics";

type TrackedOutboundLinkProps = ComponentPropsWithoutRef<"a"> & {
  eventName?: string;
  eventParams?: Record<string, string | number | boolean | undefined>;
};

export function TrackedOutboundLink({
  eventName = "outbound_click",
  eventParams,
  href,
  onClick,
  ...props
}: TrackedOutboundLinkProps) {
  const hrefString = href ?? "";

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    trackEvent(eventName, {
      destination_url: hrefString,
      ...eventParams,
    });

    onClick?.(event);
  };

  return <a {...props} href={href} onClick={handleClick} />;
}
