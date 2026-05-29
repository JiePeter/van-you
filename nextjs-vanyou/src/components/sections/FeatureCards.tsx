import Image from "next/image";
import { localizedValue, type LocalizedStr } from "@/lib/sanity/localizedValue";
import { resolveLocalizedImage } from "@/lib/sanity/resolveImage";

interface FeatureCardsProps {
  data: Record<string, unknown>;
  locale: string;
}

export default function FeatureCards({ data, locale }: FeatureCardsProps) {
  const anchorId = data.anchorId as string | undefined;
  const title = localizedValue(data.title as LocalizedStr, locale);
  const items = (data.items as Array<Record<string, unknown>>) ?? [];

  return (
    <section id={anchorId} className="py-16 md:py-24 bg-base-200/50">
      <div className="max-w-7xl mx-auto px-4">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
            {title}
          </h2>
        )}
        <div className="flex flex-wrap justify-center gap-8">
          {items.map((item, idx) => {
            const itemTitle = localizedValue(item.title as LocalizedStr, locale);
            const description = localizedValue(item.description as LocalizedStr, locale);
            const icon = resolveLocalizedImage(item.icon as Record<string, unknown> | undefined, locale, 96);
            return (
              <div
                key={idx}
                className="card card-lift bg-base-100 shadow-md w-full sm:basis-[calc(50%-1rem)] lg:basis-[calc(33.333%-1.334rem)] xl:basis-[calc(25%-1.5rem)] shrink-0"
              >
                <div className="card-body items-center text-center">
                  {/* 图标圆圈：渐变背景 + 阴影 */}
                  {icon ? (
                    <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary/15 to-secondary/15 p-3 shadow-sm mb-2">
                      <Image
                        src={icon.src}
                        alt={icon.alt}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-primary-content font-bold text-xl shadow-md mb-2">
                      {idx + 1}
                    </div>
                  )}
                  <h3 className="card-title text-lg">{itemTitle ?? "Feature"}</h3>
                  {description && (
                    <p className="opacity-70 text-sm leading-relaxed">{description}</p>
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
