import Image from "next/image";
import { localizedValue, type LocalizedStr } from "@/lib/sanity/localizedValue";
import { resolveLink } from "@/lib/sanity/resolveLink";
import { resolveLocalizedImage } from "@/lib/sanity/resolveImage";

interface PromoMediaSplitProps {
  data: Record<string, unknown>;
  locale: string;
}

export default function PromoMediaSplit({ data, locale }: PromoMediaSplitProps) {
  const anchorId = data.anchorId as string | undefined;
  const heading = localizedValue(data.heading as LocalizedStr, locale);
  const body = data.body as { en?: unknown; zh?: unknown; fr?: unknown } | undefined;
  const ctaLabel = localizedValue(data.ctaLabel as LocalizedStr, locale);
  const link = resolveLink(data.ctaLink as Record<string, unknown> | undefined);

  const bodyForLocale = body ? localizedValue(body, locale) : undefined;
  let bodyText = "";
  if (typeof bodyForLocale === "string") {
    bodyText = bodyForLocale;
  } else if (Array.isArray(bodyForLocale)) {
    const arr = bodyForLocale as Array<{ children?: Array<{ text?: string }> }>;
    bodyText = arr
      .map((b) => b?.children?.map((c) => c?.text ?? "").join(""))
      .join("\n");
  }

  const mediaList = (data.media as Array<Record<string, unknown>>) ?? [];
  const firstImage = mediaList.length > 0
    ? resolveLocalizedImage(mediaList[0], locale, 800)
    : null;

  return (
    <section id={anchorId} className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* 文字侧 */}
          <div>
            {/* 装饰性强调线 */}
            <div className="w-12 h-1 bg-primary rounded-full mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
              {heading ?? "Promo Heading"}
            </h2>
            {bodyText && (
              <p className="opacity-70 mb-8 whitespace-pre-wrap leading-relaxed">{bodyText}</p>
            )}
            {ctaLabel && (
              <a
                href={link.href}
                target={link.target}
                rel={link.rel}
                className="btn btn-outline btn-arrow"
              >
                {ctaLabel}
                <span className="arrow-icon">→</span>
              </a>
            )}
          </div>

          {/* 图片侧：装饰性偏移框 + 阴影 */}
          <div className="relative">
            {/* 装饰背景块：在图片后方偏移 */}
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-box bg-primary/10 hidden md:block" />
            {firstImage ? (
              <div className="relative h-72 md:h-96 rounded-box overflow-hidden shadow-xl">
                <Image
                  src={firstImage.src}
                  alt={firstImage.alt}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="relative h-72 md:h-96 rounded-box bg-linear-to-br from-base-300 via-primary/15 to-secondary/20 shadow-xl" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
