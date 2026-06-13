import Image from "next/image";
import { localizedValue, type LocalizedStr } from "@/lib/sanity/localizedValue";
import { resolveLocalizedImage } from "@/lib/sanity/resolveImage";

interface CardData {
  name?: string;
  title?: LocalizedStr;
  company?: string;
  website?: string;
  seal?: Record<string, unknown>;
}

interface BusinessCardProps {
  card: CardData;
  phones?: string[];
  email?: string;
  locale: string;
  /** 楷体类（仅用于名片中的中文文字，如职务「创始人兼总裁」；英文部分不套楷体） */
  kaiClass?: string;
}

// 把原"名片图"用 HTML/CSS 重绘：深色印章块 + 蓝→青斜切 chevron + 白色信息块
export default function BusinessCard({ card, phones, email, locale, kaiClass = "" }: BusinessCardProps) {
  const title = localizedValue(card.title, locale);
  const seal = resolveLocalizedImage(card.seal, locale, 200);
  const website = card.website;
  const websiteHref = website
    ? website.startsWith("http")
      ? website
      : `https://${website.replace(/^www\./, "www.")}`
    : undefined;

  return (
    <div className="relative grid grid-cols-[92px_1fr] overflow-hidden bg-white text-[#071225] border border-[#d7deea] shadow-[0_22px_50px_rgba(7,18,37,0.12)]">
      {/* 左：深色印章块 */}
      <div className="relative bg-[#071426] flex items-center justify-center p-2.5">
        {seal && (
          <Image
            src={seal.src}
            alt={seal.alt}
            width={64}
            height={96}
            className="h-auto w-full max-w-[60px] object-contain"
          />
        )}
      </div>

      {/* 蓝→青斜切 chevron：紧接深色印章块右侧，保证印章左右留白对称 */}
      <div
        aria-hidden
        className="absolute left-[90px] top-0 h-full w-7 bg-gradient-to-b from-primary to-secondary [clip-path:polygon(0_0,100%_0,35%_50%,100%_100%,0_100%)]"
      />

      {/* 右：信息块 */}
      <div className="py-5 pl-7 pr-5">
        {card.name && (
          <p className="text-xl md:text-2xl font-black tracking-wide leading-none">{card.name}</p>
        )}
        {title && (
          <p className={`mt-1.5 text-primary text-sm font-bold tracking-[0.14em] uppercase ${kaiClass}`}>{title}</p>
        )}
        {card.company && (
          <p className="mt-2 text-[#5b6680] text-sm font-semibold">{card.company}</p>
        )}
        <div className="mt-3 space-y-1 text-sm font-semibold">
          {phones?.map((p) => (
            <a key={p} href={`tel:${p.replace(/[^+\d]/g, "")}`} className="block hover:text-primary">
              {p}
            </a>
          ))}
          {email && (
            <a href={`mailto:${email}`} className="block break-all hover:text-primary">
              {email}
            </a>
          )}
          {website && websiteHref && (
            <a href={websiteHref} target="_blank" rel="noopener noreferrer" className="block hover:text-primary">
              {website}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
