import { getLocale } from "next-intl/server";
import { headers } from "next/headers";
import { fetchSanityData } from "@/lib/sanity/fetch";
import { landingPageQuery, siteSettingsQuery } from "@/lib/sanity/queries";
import { localizedValue } from "@/lib/sanity/localizedValue";
import { buildPageMetadata, buildOrganizationJsonLd } from "@/lib/seo";
import SectionRenderer from "@/components/sections/SectionRenderer";
import type { Metadata } from "next";
import type { LandingPage, SiteSettings } from "@/types/sanity";

const FORM_TOKEN_HEADER = "x-form-token";

// ISR：与 layout 一致，60s 再验证
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const page = await fetchSanityData<LandingPage>(landingPageQuery, "landingPage");
  const settings = await fetchSanityData<SiteSettings>(siteSettingsQuery, "siteSettings");

  return buildPageMetadata({
    pageSeo: page.seo as Record<string, unknown> | undefined,
    seoDefault: settings.seoDefault as Record<string, unknown> | undefined,
    locale,
    path: "",
    fallbackTitle: process.env.NEXT_PUBLIC_PROJECT_NAME ?? "VANYOU Cargo Solutions Inc.",
  });
}

export default async function LandingPageRoute() {
  const locale = await getLocale();
  const page = await fetchSanityData<LandingPage>(landingPageQuery, "landingPage");
  const settings = await fetchSanityData<SiteSettings>(siteSettingsQuery, "siteSettings");

  const orgName =
    localizedValue(settings.siteName, locale) ??
    process.env.NEXT_PUBLIC_PROJECT_NAME ??
    "VANYOU Cargo Solutions Inc.";

  const jsonLd = buildOrganizationJsonLd({
    name: orgName,
    description: process.env.NEXT_PUBLIC_PROJECT_DESCRIPTION ?? "Warehouse & logistics services, Vancouver",
    email: settings.contact?.email,
    telephone: settings.contact?.phone,
    areaServed: "Vancouver & the Lower Mainland",
  });

  // Token is set as a cookie and injected as a request header by proxy.ts.
  // Reading headers is always allowed in Server Components.
  const headerStore = await headers();
  const formToken = headerStore.get(FORM_TOKEN_HEADER) ?? "";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SectionRenderer
        sections={page.sections as unknown as Array<{ _type: string; _key: string; [key: string]: unknown }>}
        locale={locale}
        formToken={formToken}
      />
    </>
  );
}
