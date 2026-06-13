import Image from "next/image";
import { localizedValue, type LocalizedStr } from "@/lib/sanity/localizedValue";
import { resolveLink } from "@/lib/sanity/resolveLink";
import { resolveLocalizedImage } from "@/lib/sanity/resolveImage";
import Parallax from "../motion/Parallax";
import RouteLines from "../motion/RouteLines";

interface HeroProps {
  data: Record<string, unknown>;
  locale: string;
}

export default function Hero({ data, locale }: HeroProps) {
  const anchorId = data.anchorId as string | undefined;
  const kicker = localizedValue(data.kicker as LocalizedStr | undefined, locale);
  const headline = localizedValue(data.headline as LocalizedStr, locale);
  const subheadline = localizedValue(data.subheadline as LocalizedStr, locale);
  const trustLine = localizedValue(data.trustLine as LocalizedStr, locale);

  const primaryCTA = data.primaryCTA as { label?: LocalizedStr; link?: Record<string, unknown> } | undefined;
  const secondaryCTA = data.secondaryCTA as { label?: LocalizedStr; link?: Record<string, unknown> } | undefined;
  const primaryLabel = primaryCTA ? localizedValue(primaryCTA.label, locale) : undefined;
  const primaryLink = resolveLink(primaryCTA?.link);
  const secondaryLabel = secondaryCTA ? localizedValue(secondaryCTA.label, locale) : undefined;
  const secondaryLink = resolveLink(secondaryCTA?.link);

  const bg = resolveLocalizedImage(data.heroImage as Record<string, unknown> | undefined, locale, 1920);

  return (
    <section id={anchorId} data-theme="vanyou" className="hero min-h-screen relative overflow-hidden">
      {/* 背景图（轻视差） */}
      {bg ? (
        <Parallax className="absolute inset-x-0 -top-[8%] h-[116%] will-change-transform" speed={0.18}>
          <Image src={bg.src} alt={bg.alt} fill priority className="object-cover" />
        </Parallax>
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-base-300 to-secondary/20" />
      )}

      {/* 渐变遮罩：左侧加深承载文字 + 底部过渡 */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#020711]/92 via-[#020711]/45 to-[#020711]/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#020711]/90 via-transparent to-transparent" />
      {/* 航运路线图形（品牌图形系统）；移动端折叠以减负聚焦内容 */}
      <RouteLines className="absolute inset-0 h-full w-full text-secondary/15 max-md:hidden" />

      <div className="relative z-10 justify-self-start self-end w-full max-w-3xl px-6 md:px-12 lg:px-[72px] pb-24 text-left text-white">
        <div className="space-y-5">
          {/* Hero 序列：kicker → headline → subheadline → CTAs → trustLine → 装饰 */}
          {kicker && (
            <p className="text-secondary font-extrabold text-base md:text-lg tracking-[0.2em] uppercase drop-shadow">
              {kicker}
            </p>
          )}
          <h1 className="max-md:text-balance text-4xl md:text-6xl lg:text-7xl font-black leading-[1.05] drop-shadow-2xl">
            {headline ?? "VANYOU"}
          </h1>
          {subheadline && (
            <p className="text-lg md:text-xl max-w-2xl opacity-90 drop-shadow animate-[fadeInUp_0.8s_ease-out_both]">
              {subheadline}
            </p>
          )}
          <div className="flex flex-wrap gap-4 justify-start pt-4">
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
                className="btn btn-outline btn-lg btn-lift backdrop-blur-sm"
              >
                {secondaryLabel}
              </a>
            )}
          </div>
          {trustLine && (
            <p className="max-md:hidden text-sm md:text-base tracking-widest uppercase opacity-85">
              {trustLine}
            </p>
          )}
          {/* 装饰分割线 */}
          <div className="accent-divider mx-0!" />
        </div>
      </div>

      {/* 底部渐变过渡到下一 section */}
      {/* 底部渐变到 base-100（深navy，由 section 的 data-theme=vanyou 保证） */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-base-100 to-transparent" />
    </section>
  );
}
