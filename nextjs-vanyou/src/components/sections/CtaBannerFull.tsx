import Image from "next/image";
import { localizedValue, type LocalizedStr } from "@/lib/sanity/localizedValue";
import { resolveLink } from "@/lib/sanity/resolveLink";
import { resolveLocalizedImage } from "@/lib/sanity/resolveImage";

interface CtaBannerFullProps {
  data: Record<string, unknown>;
  locale: string;
}

export default function CtaBannerFull({ data, locale }: CtaBannerFullProps) {
  const anchorId = data.anchorId as string | undefined;
  const variant = (data.variant as string) ?? "full";
  const title = localizedValue(data.title as LocalizedStr, locale);
  const subtitle = localizedValue(data.subtitle as LocalizedStr, locale);
  const ctaLabel = localizedValue(data.ctaLabel as LocalizedStr, locale);
  const link = resolveLink(data.ctaLink as Record<string, unknown> | undefined);
  const bg = resolveLocalizedImage(data.backgroundImage as Record<string, unknown> | undefined, locale, 1920);

  const isSplit = variant === "split";

  return (
    <div id={anchorId} className="relative py-20 md:py-28 overflow-hidden">
      {/* 背景层 */}
      {bg ? (
        <>
          <Image src={bg.src} alt={bg.alt} fill className="object-cover" />
          <div className="absolute inset-0 bg-linear-to-r from-neutral/90 to-neutral/70" />
        </>
      ) : (
        <div className="absolute inset-0 bg-neutral" />
      )}

      {/* 装饰性斜条纹图案 */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 20px, currentColor 20px, currentColor 21px)",
        }}
        aria-hidden="true"
      />

      <div
        className={`relative z-10 max-w-5xl mx-auto px-4 text-white ${
          isSplit ? "flex flex-col lg:flex-row items-center gap-10" : "text-center"
        }`}
      >
        <div className={isSplit ? "flex-1" : "max-w-3xl mx-auto"}>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            {title ?? "Get Started Today"}
          </h2>
          {subtitle && (
            <p className="text-lg opacity-85 mb-8 max-w-2xl">
              {subtitle}
            </p>
          )}
          {ctaLabel && (
            <a
              href={link.href}
              target={link.target}
              rel={link.rel}
              className="btn btn-accent btn-lg btn-arrow"
            >
              {ctaLabel}
              <span className="arrow-icon">→</span>
            </a>
          )}
        </div>
        {isSplit && (
          <div className="h-48 md:h-64 w-full lg:w-80 rounded-box bg-primary/20 border border-primary/30 backdrop-blur-sm" />
        )}
      </div>
    </div>
  );
}
