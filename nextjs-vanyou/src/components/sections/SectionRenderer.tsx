import RevealOnScroll from "../motion/RevealOnScroll";

// VANYOU 单页 section
import Hero from "./Hero";
import Services from "./Services";
import AboutBio from "./AboutBio";
import ContactBooking from "./ContactBooking";

interface SectionRendererProps {
  sections: Array<{ _type: string; _key: string; [key: string]: unknown }>;
  locale: string;
  /** 仅加载页面时由服务端注入，用于表单防「直接调接口」的批量提交 */
  formToken?: string;
}

const IMMEDIATE_TYPES = new Set(["hero"]);

/** section _type -> 背景光晕变体（hero 自带全屏背景不挂光晕） */
const GLOW_MAP: Record<string, string> = {};

export default function SectionRenderer({ sections, locale, formToken }: SectionRendererProps) {
  return (
    <>
      {sections.map((section) => {
        const visible = section.visibleInLocales as string[] | undefined;
        if (visible && visible.length > 0 && !visible.includes(locale)) return null;

        let node: React.ReactNode;
        switch (section._type) {
          case "hero":
            node = <Hero data={section} locale={locale} />;
            break;
          case "services":
            node = <Services data={section} locale={locale} />;
            break;
          case "aboutBio":
            node = <AboutBio data={section} locale={locale} />;
            break;
          case "contactBooking":
            node = <ContactBooking data={section} locale={locale} formToken={formToken} />;
            break;
          default:
            node = null;
        }

        if (!node) return null;

        const glowClass = GLOW_MAP[section._type] ?? "";

        return (
          <RevealOnScroll
            key={section._key}
            immediate={IMMEDIATE_TYPES.has(section._type)}
          >
            <div className={glowClass}>
              {node}
            </div>
          </RevealOnScroll>
        );
      })}
    </>
  );
}
