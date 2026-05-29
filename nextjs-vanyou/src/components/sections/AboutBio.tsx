import Image from "next/image";
import { useTranslations } from "next-intl";
import { localizedValue, type LocalizedStr } from "@/lib/sanity/localizedValue";
import { resolveLink } from "@/lib/sanity/resolveLink";
import { resolveLocalizedImage } from "@/lib/sanity/resolveImage";

interface AboutBioProps {
  data: Record<string, unknown>;
  locale: string;
}

export default function AboutBio({ data, locale }: AboutBioProps) {
  const t = useTranslations("AboutBio");
  const anchorId = data.anchorId as string | undefined;
  const title = localizedValue(data.title as LocalizedStr, locale);
  const bio = localizedValue(data.bio as LocalizedStr, locale);
  const headshot = resolveLocalizedImage(data.image as Record<string, unknown> | undefined, locale, 600);
  const seal = resolveLocalizedImage(data.seal as Record<string, unknown> | undefined, locale, 200);

  const ctaLabel = localizedValue(data.ctaLabel as LocalizedStr, locale);
  const ctaLinkData = data.ctaLink as Record<string, unknown> | undefined;
  const ctaLink = resolveLink(ctaLinkData);

  const stats = (data.stats as Array<{ _key: string; value: LocalizedStr; label: LocalizedStr }> | undefined) ?? [];

  // 按双换行拆成段落，首段作为 lead 突出层次
  const bioParagraphs = bio
    ? bio.split(/\n\n+/).filter((p) => p.trim())
    : [];

  return (
    <section id={anchorId} className="py-20 px-4 bg-base-200 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* 图片区：衬底层 + 主图 + 右下 accent 条，增强层次 */}
          <div className="rv rv-left rv-2 relative pl-4 pt-4 md:pl-6 md:pt-6">
            {/* 衬底：偏移的色块形成景深（直角、克制的青蓝描边） */}
            <div
              className="absolute inset-0 top-4 left-4 md:top-6 md:left-6 border border-secondary/30"
              aria-hidden
            />
            {headshot ? (
              <figure className="relative h-[500px] overflow-hidden shadow-2xl ring-1 ring-white/10">
                <Image src={headshot.src} alt={headshot.alt} fill className="object-cover img-zoom" />
                {/* 右下角 accent 条 */}
                <span className="absolute bottom-0 right-0 w-24 h-1.5 bg-accent" aria-hidden />
              </figure>
            ) : (
              <div className="relative h-[500px] bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center shadow-2xl ring-1 ring-white/10">
                <span className="text-8xl opacity-30">🚚</span>
                <span className="absolute bottom-0 right-0 w-24 h-1.5 bg-accent" aria-hidden />
              </div>
            )}
          </div>
          <div className="border-l-2 border-primary/40 pl-6 lg:pl-10 py-1">
            {seal && (
              <Image
                src={seal.src}
                alt={seal.alt}
                width={72}
                height={72}
                className="rv rv-1 mb-5 h-[72px] w-auto [filter:drop-shadow(0_0_18px_rgba(255,255,255,0.26))]"
              />
            )}
            {/* 上标装饰线 + 标题层级 */}
            <div className="rv rv-1 flex flex-col gap-2 mb-4">
              <span className="text-sm font-semibold tracking-widest uppercase text-primary/90">
                {t("aboutLabel")}
              </span>
              {title && (
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-base-content">
                  {title}
                </h2>
              )}
            </div>
            <div className="rv rv-2 accent-divider mx-0! w-12" />
            {bioParagraphs.length > 0 && (
              <div className="rv rv-3 space-y-5 mb-10">
                {bioParagraphs.map((para, i) => (
                  <p
                    key={i}
                    className={
                      i === 0
                        ? "text-lg md:text-xl text-base-content/95 font-medium leading-relaxed"
                        : "text-base md:text-lg text-base-content/80 leading-relaxed"
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
                className="rv rv-4 btn btn-primary btn-lg btn-lift"
              >
                {ctaLabel}
              </a>
            )}
          </div>
        </div>
        {stats.length > 0 && (
          <div className="rv rv-stagger mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {stats.map((s) => (
              <div key={s._key} className="p-7 bg-white/[0.07] border border-white/[0.13]">
                <strong className="font-kai block w-fit bg-gradient-to-tr from-primary via-primary to-secondary bg-clip-text text-transparent text-[clamp(2rem,5vw,3.4rem)] leading-[1.1] font-black">
                  {localizedValue(s.value, locale)}
                </strong>
                <span className="block mt-2 text-[#d7e1f8] font-bold">
                  {localizedValue(s.label, locale)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
