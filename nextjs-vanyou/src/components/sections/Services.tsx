import Image from "next/image";
import {
  Warehouse,
  Container,
  Truck,
  PackageCheck,
  ClipboardList,
  Boxes,
  type LucideIcon,
} from "lucide-react";
import { localizedValue, type LocalizedStr } from "@/lib/sanity/localizedValue";
import { resolveLocalizedImage } from "@/lib/sanity/resolveImage";

interface ServicesProps {
  data: Record<string, unknown>;
  locale: string;
}

interface ServiceItem {
  _key: string;
  icon?: string;
  image?: Record<string, unknown>;
  title: LocalizedStr;
  description: LocalizedStr;
  wide?: boolean;
  sideImage?: Record<string, unknown>;
}

// 服务图标键 → lucide 图标（细线风格，呼应 vanyou-services-panel.png）
const SERVICE_ICONS: Record<string, LucideIcon> = {
  warehouse: Warehouse,
  container: Container,
  truck: Truck,
  crossdock: PackageCheck,
  inventory: ClipboardList,
  boxes: Boxes,
};

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
      className="relative overflow-hidden bg-[#f4f7fb] text-[#071225] py-16 md:py-24 lg:py-28 px-5 md:px-12 lg:px-[72px]"
    >
      {/* 品牌蓝图网格纹理（白底海军蓝细线） */}
      <div className="absolute inset-0 blueprint-grid" aria-hidden />
      <div className="relative z-10 max-w-7xl mx-auto">
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
          {items.flatMap((item) => {
            const img = resolveLocalizedImage(item.image, locale, 900);
            const side = resolveLocalizedImage(item.sideImage, locale, 1200);
            const name = localizedValue(item.title, locale);
            const desc = localizedValue(item.description, locale);
            const Icon = item.icon ? SERVICE_ICONS[item.icon] : undefined;

            const card = (
              <article
                key={item._key}
                className={`group card-hover-soft relative min-h-[320px] overflow-hidden bg-[#030812] border border-[#d7deea] shadow-[0_22px_50px_rgba(7,18,37,0.08)] ${
                  item.wide ? "lg:col-span-2" : ""
                }`}
              >
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
                {/* 可读性遮罩：底部加深承托文字 */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#030812]/92 via-[#030812]/45 to-transparent"
                  aria-hidden
                />
                {/* 文本覆盖在图片底部 */}
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  {Icon && (
                    <span className="mb-3 inline-flex h-7 w-7 md:h-11 md:w-11 items-center justify-center text-secondary md:bg-primary md:text-primary-content">
                      <Icon className="h-7 w-7 md:h-6 md:w-6" strokeWidth={1.5} aria-hidden />
                    </span>
                  )}
                  <h3 className="text-[1.4rem] leading-tight font-bold mb-2">
                    {name}
                  </h3>
                  {desc && (
                    <p className="text-white/80 text-[0.95rem] leading-relaxed">{desc}</p>
                  )}
                </div>
              </article>
            );

            // 补充图：独立成卡，与所属卡同宽（跨两列），裁切填充品牌图
            if (side) {
              return [
                card,
                <article
                  key={`${item._key}-side`}
                  className={`card-hover-soft relative aspect-video md:aspect-auto md:min-h-[240px] overflow-hidden border border-[#d7deea] bg-[#030812] shadow-[0_22px_50px_rgba(7,18,37,0.08)] ${
                    item.wide ? "lg:col-span-2" : ""
                  }`}
                >
                  <Image
                    src={side.src}
                    alt={side.alt}
                    fill
                    className="object-cover"
                  />
                </article>,
              ];
            }

            return [card];
          })}
        </div>
      </div>
    </section>
  );
}
