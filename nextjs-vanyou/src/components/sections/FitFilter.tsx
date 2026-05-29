import { localizedValue, type LocalizedStr } from "@/lib/sanity/localizedValue";

interface FitFilterProps {
  data: Record<string, unknown>;
  locale: string;
}

interface FitItem {
  _key: string;
  text: LocalizedStr;
}

const DEFAULT_GOOD_FIT_TITLE = { en: "Good fit if…", zh: "适合你，如果…", zhHant: "適合你，如果…", fr: "C'est pour vous si…" };
const DEFAULT_NOT_FIT_TITLE = { en: "Probably not if…", zh: "可能不适合，如果…", zhHant: "可能不適合，如果…", fr: "Probablement pas si…" };

export default function FitFilter({ data, locale }: FitFilterProps) {
  const anchorId = data.anchorId as string | undefined;
  const title = localizedValue(data.title as LocalizedStr, locale);
  const goodFitTitle = localizedValue((data.goodFitTitle as LocalizedStr) ?? DEFAULT_GOOD_FIT_TITLE, locale);
  const notFitTitle = localizedValue((data.notFitTitle as LocalizedStr) ?? DEFAULT_NOT_FIT_TITLE, locale);
  const goodFit = data.goodFit as FitItem[] | undefined;
  const notFit = data.notFit as FitItem[] | undefined;

  return (
    <section id={anchorId} className="py-20 px-4 bg-base-200">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-14">
          {title && (
            <h2 className="rv rv-1 text-3xl md:text-5xl font-bold mb-4">
              {title}
            </h2>
          )}
          <div className="rv rv-2 accent-divider" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 rv-stagger">
          <div className="card bg-base-100 shadow-lg border border-success/30 card-hover">
            <div className="card-body">
              <h3 className="card-title text-success text-xl mb-4">
                ✅ {goodFitTitle}
              </h3>
              <ul className="space-y-3">
                {goodFit?.map((item) => (
                  <li key={item._key} className="flex items-start gap-3">
                    <span className="text-success mt-0.5 shrink-0">✓</span>
                    <span className="text-base-content/90">{localizedValue(item.text, locale)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="card bg-base-100 shadow-lg border border-base-content/20 card-hover">
            <div className="card-body">
              <h3 className="card-title text-base-content/90 text-xl mb-4">
                ✗ {notFitTitle}
              </h3>
              <ul className="space-y-3">
                {notFit?.map((item) => (
                  <li key={item._key} className="flex items-start gap-3">
                    <span className="text-base-content/60 mt-0.5 shrink-0">✗</span>
                    <span className="text-base-content/90">{localizedValue(item.text, locale)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
