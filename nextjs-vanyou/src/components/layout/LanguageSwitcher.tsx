"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { locales } from "@/i18n/config";

const localeLabels: Record<string, string> = {
  en: "EN",
  zh: "中文",
  "zh-Hant": "繁中",
  fr: "FR",
};

interface LanguageSwitcherProps {
  enabledLocales?: string[];
}

export default function LanguageSwitcher({ enabledLocales }: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();

  // 按 config 中的顺序过滤出已启用的 locale
  const visible = enabledLocales
    ? locales.filter((l) => enabledLocales.includes(l))
    : locales;

  if (visible.length <= 1) return null;

  return (
    <div className="inline-flex items-center overflow-hidden bg-base-200/60">
      {visible.map((l) => (
        <Link
          key={l}
          href={pathname || "/"}
          locale={l}
          className={`px-3 py-1 text-xs font-medium transition-all duration-200 ${
            l === locale
              ? "bg-primary text-primary-content shadow-sm"
              : "text-base-content/60 hover:text-base-content hover:bg-base-300/50"
          }`}
        >
          {localeLabels[l]}
        </Link>
      ))}
    </div>
  );
}
