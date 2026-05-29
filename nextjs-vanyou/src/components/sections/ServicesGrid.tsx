import Image from "next/image";
import { localizedValue, type LocalizedStr } from "@/lib/sanity/localizedValue";
import { resolveLink } from "@/lib/sanity/resolveLink";
import { resolveLocalizedImage } from "@/lib/sanity/resolveImage";

interface ServicesGridProps {
  data: Record<string, unknown>;
  locale: string;
}

export default function ServicesGrid({ data, locale }: ServicesGridProps) {
  const anchorId = data.anchorId as string | undefined;
  const title = localizedValue(data.title as LocalizedStr, locale);
  const intro = localizedValue(data.intro as LocalizedStr, locale);
  const items = (data.items as Array<Record<string, unknown>>) ?? [];

  return (
    <section id={anchorId} className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          {title ?? "Our Services"}
        </h2>
        {intro && (
          <p className="text-center opacity-70 max-w-2xl mx-auto mb-14">
            {intro}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-8">
          {items.map((item, idx) => {
            const name = localizedValue(item.name as LocalizedStr, locale);
            const description = localizedValue(item.description as LocalizedStr, locale);
            const bullets = (item.bullets as Array<LocalizedStr>) ?? [];
            const ctaLabel = localizedValue(item.ctaLabel as LocalizedStr | undefined, locale);
            const ctaLink = resolveLink(item.ctaLink as Record<string, unknown> | undefined);
            const img = resolveLocalizedImage(item.image as Record<string, unknown> | undefined, locale, 600);
            return (
              <div
                key={idx}
                className="group card card-lift bg-base-100 shadow-md w-full sm:basis-[calc(50%-1rem)] lg:basis-[calc(33.333%-1.334rem)] shrink-0 overflow-hidden"
              >
                {/* 图片区：悬浮缩放 */}
                <figure className="relative h-52 overflow-hidden">
                  {img ? (
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover img-zoom"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-linear-to-br from-base-300 via-primary/15 to-secondary/20 img-zoom" />
                  )}
                  {/* 图片底部渐变遮罩 */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-base-100/80 to-transparent" />
                </figure>
                <div className="card-body">
                  <h3 className="card-title">{name ?? "Service"}</h3>
                  {description && (
                    <p className="opacity-70 text-sm">{description}</p>
                  )}
                  {bullets.length > 0 && (
                    <ul className="space-y-1.5 text-sm opacity-70 mt-1">
                      {bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">✓</span>
                          {localizedValue(b, locale)}
                        </li>
                      ))}
                    </ul>
                  )}
                  {ctaLabel && (
                    <div className="card-actions justify-end mt-3">
                      <a
                        href={ctaLink.href}
                        target={ctaLink.target}
                        rel={ctaLink.rel}
                        className="btn btn-primary btn-sm btn-arrow"
                      >
                        {ctaLabel}
                        <span className="arrow-icon">→</span>
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
