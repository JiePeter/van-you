// localizedImage → { src, alt } 解析，基于 locale 回退
import { urlFor } from "./image";
import { localizedValue } from "./localizedValue";

interface LocalizedImageData {
  asset?: unknown;
  /** 本地/静态图片直链（mock 数据、未接 Sanity 时使用，如 /brand/x.png） */
  src?: string;
  alt?: { en?: string; zh?: string; zhHant?: string; fr?: string };
}

export interface ResolvedImage {
  src: string;
  alt: string;
}

export function resolveLocalizedImage(
  img: LocalizedImageData | undefined | null,
  locale: string,
  width?: number
): ResolvedImage | null {
  if (!img) return null;

  // 本地直链优先（无 Sanity asset 时）
  if (typeof img.src === "string" && img.src) {
    return { src: img.src, alt: localizedValue(img.alt, locale) ?? "" };
  }

  if (!img.asset) return null;

  let builder = urlFor(img.asset);
  if (width) builder = builder.width(width);

  return {
    src: builder.auto("format").url(),
    alt: localizedValue(img.alt, locale) ?? "",
  };
}
