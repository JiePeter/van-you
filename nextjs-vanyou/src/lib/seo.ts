import type { Metadata } from "next";
import { localizedValue, type LocalizedStr } from "./sanity/localizedValue";
import { resolveLocalizedImage } from "./sanity/resolveImage";

interface SeoFields {
  title?: Record<string, string | undefined>;
  description?: Record<string, string | undefined>;
  ogImage?: Record<string, unknown>;
}

interface BuildMetadataOptions {
  pageSeo?: Record<string, unknown>;
  seoDefault?: Record<string, unknown>;
  locale: string;
  path: string;
  fallbackTitle: string;
}

export function buildPageMetadata({
  pageSeo,
  seoDefault,
  locale,
  path,
  fallbackTitle,
}: BuildMetadataOptions): Metadata {
  const title: string =
    localizedValue(pageSeo?.title as LocalizedStr | undefined, locale) ??
    localizedValue(seoDefault?.title as LocalizedStr | undefined, locale) ??
    fallbackTitle;

  const description: string | undefined =
    localizedValue(pageSeo?.description as LocalizedStr | undefined, locale) ??
    localizedValue(seoDefault?.description as LocalizedStr | undefined, locale);

  const ogImage = resolveLocalizedImage(
    (pageSeo?.ogImage ?? seoDefault?.ogImage) as Record<string, unknown> | undefined,
    locale,
    1200
  );

  const prefix = path ? `/${path}` : "";

  return {
    title,
    description,
    alternates: {
      languages: {
        en: `/en${prefix}`,
        zh: `/zh${prefix}`,
        "zh-Hant": `/zh-Hant${prefix}`,
        fr: `/fr${prefix}`,
      },
    },
    openGraph: {
      title,
      description: description ?? undefined,
      ...(ogImage ? { images: [{ url: ogImage.src, alt: ogImage.alt }] } : {}),
    },
  };
}

// Organization JSON-LD
interface OrganizationOptions {
  name: string;
  description?: string;
  email?: string;
  telephone?: string;
  areaServed?: string;
}

export function buildOrganizationJsonLd(opts: OrganizationOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: opts.name,
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.email ? { email: opts.email } : {}),
    ...(opts.telephone ? { telephone: opts.telephone } : {}),
    ...(opts.areaServed ? { areaServed: opts.areaServed } : {}),
  };
}

// Review JSON-LD（用于旧组件库 TestimonialsCarousel）
interface ReviewOptions {
  author: string;
  rating?: number;
  reviewBody?: string;
  datePublished?: string;
}

export function buildReviewJsonLd(opts: ReviewOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    author: {
      "@type": "Person",
      name: opts.author,
    },
    ...(opts.rating ? { reviewRating: { "@type": "Rating", ratingValue: opts.rating } } : {}),
    ...(opts.reviewBody ? { reviewBody: opts.reviewBody } : {}),
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
  };
}

