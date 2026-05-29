import { getLocale, getTranslations } from "next-intl/server";
import { fetchSanityData } from "@/lib/sanity/fetch";
import { navigationQuery, siteSettingsQuery } from "@/lib/sanity/queries";
import { localizedValue } from "@/lib/sanity/localizedValue";
import { SocialIcon } from "./SocialIcon";

interface LocalizedString {
  en?: string;
  zh?: string;
  zhHant?: string;
  fr?: string;
}

interface MenuItem {
  label?: LocalizedString;
  link?: { type?: string; url?: string; anchor?: string };
}

interface FooterGroup {
  _key?: string;
  title?: LocalizedString;
  items?: MenuItem[];
}

interface NavigationData {
  footerGroups?: FooterGroup[];
}

interface SiteSettingsData {
  siteName?: LocalizedString;
  socialLinks?: Array<{ label?: LocalizedString; url?: string }>;
}

export default async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("Footer");
  const settings = await fetchSanityData<SiteSettingsData>(siteSettingsQuery, "siteSettings");
  const nav = await fetchSanityData<NavigationData>(navigationQuery, "navigation");
  const year = new Date().getFullYear();
  const siteName = localizedValue(settings.siteName, locale) ?? process.env.NEXT_PUBLIC_PROJECT_NAME ?? "VANYOU";
  const socialLinks = settings.socialLinks ?? [];

  const legalGroups = nav.footerGroups?.filter((g) => g._key !== "quick") ?? [];
  const hasSocialLinks = socialLinks.some(
    (sl) => (sl.url && sl.url !== "#") || localizedValue(sl.label, locale)
  );
  const legalItems = legalGroups.flatMap((group) => group.items ?? []);
  const hasLegalLinks = legalItems.some((item) => localizedValue(item.label, locale));
  const hasLinksRow = hasSocialLinks || hasLegalLinks;

  return (
    <footer className="bg-neutral text-neutral-content">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-3">
          {hasLinksRow && (
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {socialLinks.map((sl, idx) => {
                const label = localizedValue(sl.label, locale);
                const url = sl.url && sl.url !== "#" ? sl.url : null;
                if (!label && !url) return null;
                return (
                  <a
                    key={idx}
                    href={url ?? "#"}
                    className="flex items-center justify-center gap-2 text-neutral-content/90 hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label ?? undefined}
                  >
                    <SocialIcon url={url} label={label} className="shrink-0" />
                  </a>
                );
              })}
              {legalItems.map((item, idx) => {
                const label = localizedValue(item.label, locale);
                if (!label) return null;
                return (
                  <button
                    key={`legal-${idx}`}
                    className="text-sm text-neutral-content/70 hover:text-neutral-content underline underline-offset-2 decoration-neutral-content/20 hover:decoration-neutral-content/60 transition-colors"
                    type="button"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
          <p className="text-xs text-neutral-content/50">
            © {year} {siteName}. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
