import Image from "next/image";
import { localizedValue, type LocalizedStr } from "@/lib/sanity/localizedValue";
import { resolveLocalizedImage } from "@/lib/sanity/resolveImage";

interface RichTextSectionProps {
  data: Record<string, unknown>;
  locale: string;
}

function blocksToParagraphs(blocks: unknown): string[] {
  if (!blocks) return [];
  const arr = Array.isArray(blocks) ? blocks : [blocks];
  return arr
    .map((b: unknown) => {
      if (typeof b === "string") return b;
      const block = b as { _type?: string; children?: Array<{ text?: string }> };
      if (block?.children) {
        return block.children.map((c) => c?.text ?? "").join("");
      }
      return "";
    })
    .filter(Boolean);
}

export default function RichTextSection({ data, locale }: RichTextSectionProps) {
  const anchorId = data.anchorId as string | undefined;
  const title = localizedValue(data.title as LocalizedStr, locale);
  const body = data.body as { en?: unknown; zh?: unknown; fr?: unknown } | undefined;
  const bodyForLocale = body ? localizedValue(body, locale) : undefined;
  const paragraphs = blocksToParagraphs(bodyForLocale);
  const media = resolveLocalizedImage(data.media as Record<string, unknown> | undefined, locale, 800);

  return (
    <section id={anchorId} className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-12 gap-12">
          <div className={media ? "md:col-span-7" : "md:col-span-12"}>
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {title}
              </h2>
            )}
            <div className="prose max-w-none">
              {paragraphs.map((p, idx) => (
                <p key={idx} className="opacity-80 mb-4">
                  {p}
                </p>
              ))}
            </div>
          </div>
          {media && (
            <div className="md:col-span-5">
              <div className="relative h-64 rounded-box overflow-hidden">
                <Image src={media.src} alt={media.alt} fill className="object-cover" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
