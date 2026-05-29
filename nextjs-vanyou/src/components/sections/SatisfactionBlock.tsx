import Image from "next/image";
import { localizedValue, type LocalizedStr } from "@/lib/sanity/localizedValue";
import { resolveLink } from "@/lib/sanity/resolveLink";
import { resolveLocalizedImage } from "@/lib/sanity/resolveImage";

interface SatisfactionBlockProps {
  data: Record<string, unknown>;
  locale: string;
}

export default function SatisfactionBlock({ data, locale }: SatisfactionBlockProps) {
  const anchorId = data.anchorId as string | undefined;
  const title = localizedValue(data.title as LocalizedStr, locale);
  const body = localizedValue(data.body as LocalizedStr, locale);
  const ctaLabel = localizedValue(data.ctaLabel as LocalizedStr, locale);
  const link = resolveLink(data.ctaLink as Record<string, unknown> | undefined);
  const images = (data.images as Array<Record<string, unknown>>) ?? [];

  return (
    <section id={anchorId} className="py-16 md:py-24 bg-base-200/60">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {/* 装饰性盾牌图标 */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-primary to-secondary text-primary-content shadow-lg">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-5">
          {title ?? "Satisfaction Guarantee"}
        </h2>
        {body && (
          <p className="text-lg opacity-70 max-w-2xl mx-auto mb-10 leading-relaxed">
            {body}
          </p>
        )}

        {images.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {images.map((imgData, idx) => {
              const img = resolveLocalizedImage(imgData, locale, 200);
              return img ? (
                <div key={idx} className="relative w-28 h-28 rounded-box overflow-hidden shadow-md ring-2 ring-primary/20">
                  <Image src={img.src} alt={img.alt} fill className="object-cover" />
                </div>
              ) : (
                <div key={idx} className="w-28 h-28 rounded-box bg-linear-to-br from-base-300 to-primary/30 shadow-md" />
              );
            })}
          </div>
        )}

        {ctaLabel && (
          <a
            href={link.href}
            target={link.target}
            rel={link.rel}
            className="btn btn-primary btn-lg btn-arrow"
          >
            {ctaLabel}
            <span className="arrow-icon">→</span>
          </a>
        )}
      </div>
    </section>
  );
}
