import Image from "next/image";
import { localizedValue, type LocalizedStr } from "@/lib/sanity/localizedValue";
import { resolveLocalizedImage } from "@/lib/sanity/resolveImage";

interface ServicesProps {
  data: Record<string, unknown>;
  locale: string;
}

interface ServiceItem {
  _key: string;
  image?: Record<string, unknown>;
  title: LocalizedStr;
  description: LocalizedStr;
  wide?: boolean;
}

interface BrandStrip {
  image?: Record<string, unknown>;
  label?: LocalizedStr;
  text?: LocalizedStr;
}

// VANYOU 服务区块：浅色 paper 底，品牌横幅 + 服务卡片网格（含 wide 变体），呼应 draft 美术
export default function Services({ data, locale }: ServicesProps) {
  const anchorId = data.anchorId as string | undefined;
  const kicker = localizedValue(data.kicker as LocalizedStr | undefined, locale);
  const title = localizedValue(data.title as LocalizedStr, locale);
  const strip = data.brandStrip as BrandStrip | undefined;
  const stripLabel = localizedValue(strip?.label, locale);
  const stripText = localizedValue(strip?.text, locale);
  const items = (data.items as ServiceItem[] | undefined) ?? [];

  return (
    <section
      id={anchorId}
      className="bg-[#f4f7fb] text-[#071225] py-16 md:py-24 lg:py-28 px-5 md:px-12 lg:px-[72px]"
    >
      <div className="max-w-7xl mx-auto">
        {/* 区块标题 */}
        <div className="rv rv-1 max-w-[760px] mb-9">
          {kicker && (
            <p className="text-primary font-black text-sm tracking-[0.16em] uppercase mb-2.5">
              {kicker}
            </p>
          )}
          <h2 className="whitespace-pre-line text-[clamp(2.1rem,5vw,3.6rem)] leading-[1.04] font-bold text-[#071225]">
            {title}
          </h2>
        </div>

        {/* 品牌横幅：纯深色面板（无图位），仅标题 + 说明文字 */}
        {strip && (stripLabel || stripText) && (
          <div className="rv rv-2 mb-6 p-6 md:p-8 text-white bg-[#071426] border-l-2 border-secondary shadow-[0_18px_46px_rgba(7,18,37,0.18)]">
            {stripLabel && (
              <span className="block text-secondary font-black tracking-[0.13em] uppercase">
                {stripLabel}
              </span>
            )}
            {stripText && (
              <p className="max-w-[820px] mt-2 text-[#dce6ff] text-lg leading-relaxed">
                {stripText}
              </p>
            )}
          </div>
        )}

        {/* 服务卡片网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px] rv-stagger">
          {items.map((item) => {
            const img = resolveLocalizedImage(item.image, locale, 900);
            const name = localizedValue(item.title, locale);
            const desc = localizedValue(item.description, locale);
            return (
              <article
                key={item._key}
                className={`group card-hover-soft grid grid-rows-[1fr_auto] overflow-hidden bg-white border border-[#d7deea] shadow-[0_22px_50px_rgba(7,18,37,0.08)] ${
                  item.wide ? "lg:col-span-2" : ""
                }`}
              >
                <figure className="relative min-h-[200px] overflow-hidden">
                  {img ? (
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover img-zoom [filter:saturate(0.92)_contrast(1.05)]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#081426] via-primary/20 to-secondary/20" />
                  )}
                </figure>
                <div className="p-6">
                  <h3 className="text-[1.4rem] leading-tight font-bold text-[#071225] mb-2.5">
                    {name}
                  </h3>
                  {desc && (
                    <p className="text-[#5b6680] text-[0.95rem] leading-relaxed">{desc}</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
