import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.flugi.cz";

type PageMetadataArgs = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  imagePath?: string;
};

export function createPageMetadata({
  title,
  description,
  path,
  type = "website",
  imagePath = "/api/og.png",
}: PageMetadataArgs): Metadata {
  const url = new URL(path, baseUrl).toString();
  const image = new URL(imagePath, baseUrl).toString();

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type,
      locale: "cs_CZ",
      siteName: "Flugi.cz",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
