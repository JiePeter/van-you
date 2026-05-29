import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

// 由 projectId/dataset 直接构建（client 可能为 null）。未配置 Sanity 时 urlFor 不会被调用
// （mock 图片走 resolveLocalizedImage 的本地 src 分支），此处占位仅保证模块加载不报错。
const builder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "placeholder",
  dataset: process.env.NEXT_PUBLIC_DATASET || "production",
});

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
