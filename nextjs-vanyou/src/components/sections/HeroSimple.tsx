import Image from "next/image";
import { localizedValue, type LocalizedStr } from "@/lib/sanity/localizedValue";
import { resolveLink } from "@/lib/sanity/resolveLink";
import { resolveLocalizedImage } from "@/lib/sanity/resolveImage";

interface HeroSimpleProps {
  data: Record<string, unknown>;
  locale: string;
}

export default function HeroSimple({ data, locale }: HeroSimpleProps) {
  const anchorId = data.anchorId as string | undefined;
  const title = localizedValue(data.title as LocalizedStr, locale);
  const body = localizedValue(data.body as LocalizedStr, locale);

  const primaryCTA = data.primaryCTA as { label?: LocalizedStr; link?: Record<string, unknown> } | undefined;
  const secondaryCTA = data.secondaryCTA as { label?: LocalizedStr; link?: Record<string, unknown> } | undefined;
  const primaryLabel = primaryCTA ? localizedValue(primaryCTA.label, locale) : undefined;
  const primaryLink = resolveLink(primaryCTA?.link);
  const secondaryLabel = secondaryCTA ? localizedValue(secondaryCTA.label, locale) : undefined;
  const secondaryLink = resolveLink(secondaryCTA?.link);

  const bg = resolveLocalizedImage(data.bgImage as Record<string, unknown> | undefined, locale, 1920);

  return (
    <div id={anchorId} className="hero min-h-[50vh] relative overflow-hidden">
      {bg ? (
        <Image
          src={bg.src}
          alt={bg.alt}
          fill
          priority
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-primary/50 via-secondary/30 to-base-300" />
      )}

      {/* 渐变叠加：底部加深 */}
      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/25 to-black/10" />

      <div className="hero-content text-center text-white relative z-10">
        <div className="max-w-2xl">
          {/* 装饰性强调线 */}
          <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-primary" />

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
            {title ?? "Page Title"}
          </h1>
          {body && (
            <p className="text-lg mb-8 opacity-90 drop-shadow">
              {body}
            </p>
          )}
          <div className="flex flex-wrap gap-4 justify-center">
            {primaryLabel && (
              <a
                href={primaryLink.href}
                target={primaryLink.target}
                rel={primaryLink.rel}
                className="btn btn-primary btn-lg btn-lift"
              >
                {primaryLabel}
              </a>
            )}
            {secondaryLabel && (
              <a
                href={secondaryLink.href}
                target={secondaryLink.target}
                rel={secondaryLink.rel}
                className="btn btn-outline btn-lg btn-lift"
              >
                {secondaryLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
