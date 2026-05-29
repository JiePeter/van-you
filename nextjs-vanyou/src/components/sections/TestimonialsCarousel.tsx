import Image from "next/image";
import { localizedValue, type LocalizedStr } from "@/lib/sanity/localizedValue";
import { resolveLocalizedImage } from "@/lib/sanity/resolveImage";
import { buildReviewJsonLd } from "@/lib/seo";

interface TestimonialsCarouselProps {
  data: Record<string, unknown>;
  locale: string;
}

export default function TestimonialsCarousel({ data, locale }: TestimonialsCarouselProps) {
  const anchorId = data.anchorId as string | undefined;
  const title = localizedValue(data.title as LocalizedStr, locale);
  const items = (data.items as Array<Record<string, unknown>>) ?? [];

  const reviewItems = items
    .map((item) => ({
      quote: localizedValue(item.quote as LocalizedStr, locale) ?? "",
      name: (item.name as string) ?? "",
      meta: localizedValue(item.meta as LocalizedStr, locale),
    }))
    .filter((r) => r.quote && r.name);
  
  // 为每个 review 生成 JSON-LD（旧组件库，保留兼容）
  const reviewJsonLd = reviewItems.length > 0 ? reviewItems.map(r => buildReviewJsonLd({
    author: r.name,
    reviewBody: r.quote,
  })) : [];

  return (
    <section id={anchorId} className="py-16 md:py-24 bg-base-200/50">
      {reviewJsonLd.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewJsonLd) }}
        />
      )}
      <div className="max-w-7xl mx-auto px-4">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
            {title}
          </h2>
        )}
        <div className="flex flex-wrap justify-center gap-8">
          {items.map((item, idx) => {
            const quote = localizedValue(item.quote as LocalizedStr, locale);
            const name = item.name as string;
            const meta = localizedValue(item.meta as LocalizedStr, locale);
            const avatar = resolveLocalizedImage(item.avatar as Record<string, unknown> | undefined, locale, 80);
            return (
              <div
                key={idx}
                className="card card-lift bg-base-100 shadow-md border-l-4 border-l-primary w-full sm:basis-[calc(50%-1rem)] lg:basis-[calc(33.333%-1.334rem)] shrink-0"
              >
                <div className="card-body relative">
                  {/* 装饰性大引号 */}
                  <span className="absolute -top-2 left-4 text-6xl leading-none text-primary/15 font-serif select-none" aria-hidden="true">
                    &ldquo;
                  </span>

                  {quote && (
                    <blockquote className="relative z-10 italic opacity-80 mb-5 pt-4 leading-relaxed">
                      {quote}
                    </blockquote>
                  )}

                  {/* 分隔线 + 用户信息 */}
                  <div className="divider my-0" />
                  <div className="flex items-center gap-3 mt-1">
                    {avatar ? (
                      <div className="avatar">
                        <div className="w-11 rounded-full ring ring-primary/20 ring-offset-base-100 ring-offset-2">
                          <Image
                            src={avatar.src}
                            alt={avatar.alt}
                            width={44}
                            height={44}
                            className="object-cover"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="avatar placeholder">
                        <div className="w-11 rounded-full bg-primary text-primary-content">
                          <span className="text-sm font-semibold">
                            {(name ?? "C")[0]}
                          </span>
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-sm">{name ?? "Client"}</p>
                      {meta && (
                        <p className="text-xs opacity-70">{meta}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
