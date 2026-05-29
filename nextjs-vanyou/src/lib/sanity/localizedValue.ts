// locale 回退逻辑：value[locale] ?? value['en']
// Sanity 字段名不允许连字符，繁中字段名为 zhHant；前端 locale 为 zh-Hant
export interface LocalizedField<T> {
  en?: T;
  zh?: T;
  zhHant?: T;
  fr?: T;
}

// 常用快捷类型
export type LocalizedStr = LocalizedField<string>;

// locale → Sanity 字段名映射
const localeKeyMap: Record<string, keyof LocalizedField<unknown>> = {
  en: "en",
  zh: "zh",
  "zh-Hant": "zhHant",
  fr: "fr",
};

export function localizedValue<T>(
  field: LocalizedField<T> | undefined | null,
  locale: string
): T | undefined {
  if (!field) return undefined;
  const key = localeKeyMap[locale] ?? locale;
  // 繁中回退链：zhHant → zh → en
  if (locale === "zh-Hant") {
    return (field.zhHant ?? field.zh ?? field.en) as T | undefined;
  }
  const value = field[key as keyof LocalizedField<T>];
  return (value ?? field.en) as T | undefined;
}
