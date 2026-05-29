import { localizedValue, type LocalizedStr } from "@/lib/sanity/localizedValue";
import { resolveLink } from "@/lib/sanity/resolveLink";

interface OffersProps {
  data: Record<string, unknown>;
  locale: string;
}

interface BulletItem {
  _key: string;
  text: LocalizedStr;
}

interface PackageItem {
  _key: string;
  name: LocalizedStr;
  audience?: LocalizedStr;
  bullets?: BulletItem[];
  cadence?: LocalizedStr;
  price: LocalizedStr;
  ctaLabel?: LocalizedStr;
  ctaLink?: Record<string, unknown>;
  highlighted?: boolean;
}

export default function Offers({ data, locale }: OffersProps) {
  const anchorId = data.anchorId as string | undefined;
  const title = localizedValue(data.title as LocalizedStr, locale);
  const subtitle = localizedValue(data.subtitle as LocalizedStr, locale);
  const packages = data.packages as PackageItem[] | undefined;

  return (
    <section id={anchorId} className="py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          {title && (
            <h2 className="rv rv-1 text-4xl md:text-5xl font-bold mb-4">{title}</h2>
          )}
          <div className="rv rv-2 accent-divider" />
          {subtitle && (
            <p className="rv rv-2 text-lg text-base-content/90 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch rv-stagger">
          {packages?.map((pkg) => {
            const name = localizedValue(pkg.name, locale);
            const audience = localizedValue(pkg.audience, locale);
            const cadence = localizedValue(pkg.cadence, locale);
            const price = localizedValue(pkg.price, locale);
            const ctaLabel = localizedValue(pkg.ctaLabel, locale);
            const ctaLink = resolveLink(pkg.ctaLink);
            const isHighlighted = pkg.highlighted ?? false;

            return (
              <div
                key={pkg._key}
                className={`card bg-base-100 shadow-xl border-2 card-hover-soft ${
                  isHighlighted
                    ? "border-primary relative"
                    : "border-base-content/15"
                }`}
              >
                {isHighlighted && (
                  <div className="badge badge-primary badge-lg absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    {locale.startsWith("zh") ? "热门" : locale === "fr" ? "Populaire" : "Popular"}
                  </div>
                )}
                <div className="card-body">
                  <h3 className="card-title text-2xl">{name}</h3>
                  {audience && (
                    <p className="text-sm text-base-content/80 mb-2">{audience}</p>
                  )}
                  <div className="my-4">
                    <span className="text-3xl font-bold text-primary">{price}</span>
                  </div>
                  {cadence && (
                    <p className="text-xs text-base-content/70 mb-4">{cadence}</p>
                  )}
                  <ul className="space-y-2 mb-6 flex-1">
                    {pkg.bullets?.map((b) => (
                      <li key={b._key} className="flex items-start gap-2">
                        <span className="text-primary shrink-0 mt-0.5">✓</span>
                        <span className="text-sm">{localizedValue(b.text, locale)}</span>
                      </li>
                    ))}
                  </ul>
                  {ctaLabel && (
                    <div className="card-actions">
                      <a
                        href={ctaLink.href}
                        target={ctaLink.target}
                        rel={ctaLink.rel}
                        className={`btn btn-block ${isHighlighted ? "btn-primary" : "btn-outline"}`}
                      >
                        {ctaLabel}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
