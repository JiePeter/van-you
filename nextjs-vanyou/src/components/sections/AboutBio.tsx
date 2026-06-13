import Image from "next/image";
import { useTranslations } from "next-intl";
import { localizedValue, type LocalizedStr } from "@/lib/sanity/localizedValue";
import { resolveLink } from "@/lib/sanity/resolveLink";
import { resolveLocalizedImage } from "@/lib/sanity/resolveImage";
import RouteLines from "../motion/RouteLines";

interface AboutBioProps {
  data: Record<string, unknown>;
  locale: string;
}

export default function AboutBio({ data, locale }: AboutBioProps) {
  const t = useTranslations("AboutBio");
  const anchorId = data.anchorId as string | undefined;
  const title = localizedValue(data.title as LocalizedStr, locale);
  const bio = localizedValue(data.bio as LocalizedStr, locale);
  const aboutImage = resolveLocalizedImage(data.image as Record<string, unknown> | undefined, locale, 1200);
  const seal = resolveLocalizedImage(data.seal as Record<string, unknown> | undefined, locale, 200);

  const ctaLabel = localizedValue(data.ctaLabel as LocalizedStr, locale);
  const ctaLink = resolveLink(data.ctaLink as Record<string, unknown> | undefined);

  // 按双换行拆段，首段作为 lead 突出层次
  const bioParagraphs = bio ? bio.split(/\n\n+/).filter((p) => p.trim()) : [];

  // 文案内容两端复用：tone=dark（移动端叠加白字）/ light（桌面浅底深字）
  const renderContent = (tone: "dark" | "light") => {
    const labelColor = tone === "dark" ? "text-secondary" : "text-primary/90";
    const titleColor = tone === "dark" ? "text-white" : "text-base-content";
    const leadColor = tone === "dark" ? "text-white/95" : "text-base-content/95";
    const bodyColor = tone === "dark" ? "text-white/75" : "text-base-content/80";
    const barColor = tone === "dark" ? "border-primary" : "border-primary/40";
    return (
      <div className={`border-l-2 ${barColor} pl-6 lg:pl-8`}>
        {seal && (
          <Image
            src={seal.src}
            alt={seal.alt}
            width={72}
            height={72}
            className="mb-3 h-16 w-auto object-contain"
          />
        )}
        <span className={`block text-xs font-semibold tracking-widest uppercase ${labelColor} mb-2`}>
          {t("aboutLabel")}
        </span>
        {title && (
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight ${titleColor}`}>
            {title}
          </h2>
        )}
        <div className="accent-divider mx-0! w-12 my-5" />
        {bioParagraphs.length > 0 && (
          <div className="space-y-4">
            {bioParagraphs.map((para, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? `text-lg md:text-xl ${leadColor} font-medium leading-relaxed`
                    : `text-base md:text-lg ${bodyColor} leading-relaxed`
                }
              >
                {para.replace(/\n/g, " ").trim()}
              </p>
            ))}
          </div>
        )}
        {ctaLabel && (
          <a
            href={ctaLink.href}
            target={ctaLink.target}
            rel={ctaLink.rel}
            className="btn btn-primary btn-lg btn-lift mt-8"
          >
            {ctaLabel}
          </a>
        )}
      </div>
    );
  };

  // 明暗交替节奏：About 保持深色；根主题已翻为浅色，故此处显式标深色
  return (
    <section id={anchorId} data-theme="vanyou" className="bg-base-200 relative overflow-hidden">
      {/* ── 移动端：图文叠加（卡车图撑满做底 + 白字面板覆盖、左侧加深承托） ── */}
      <div className="md:hidden relative min-h-[480px] overflow-hidden">
        {aboutImage ? (
          <Image src={aboutImage.src} alt={aboutImage.alt} fill priority className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-primary/25 to-secondary/20" />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#030812]/95 via-[#030812]/70 to-[#030812]/20"
          aria-hidden
        />
        <div className="relative z-10 flex min-h-[480px] max-w-xl flex-col justify-center p-8 text-white">
          {renderContent("dark")}
        </div>
      </div>

      {/* ── 桌面端：原两栏（图左 / 文右、浅底深字、RouteLines 纹理） ── */}
      <div className="hidden md:block relative py-20 px-4">
        <RouteLines className="absolute inset-0 h-full w-full text-secondary/10" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* 图片：偏移描边衬底 + 主图 + 右下 accent 条 */}
            <div className="rv rv-left rv-2 relative pl-6 pt-6">
              <div className="absolute inset-0 top-6 left-6 border border-primary/40" aria-hidden />
              {aboutImage ? (
                <figure className="relative h-[500px] overflow-hidden shadow-2xl ring-1 ring-base-content/10">
                  <Image src={aboutImage.src} alt={aboutImage.alt} fill className="object-cover img-zoom" />
                  <span className="absolute bottom-0 right-0 w-24 h-1.5 bg-secondary" aria-hidden />
                </figure>
              ) : (
                <div className="relative h-[500px] bg-linear-to-br from-primary/20 to-secondary/20 shadow-2xl ring-1 ring-base-content/10">
                  <span className="absolute bottom-0 right-0 w-24 h-1.5 bg-secondary" aria-hidden />
                </div>
              )}
            </div>
            {/* 文案 */}
            <div className="rv rv-3">{renderContent("light")}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
