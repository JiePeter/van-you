import { localizedValue, type LocalizedStr } from "@/lib/sanity/localizedValue";

interface ProcessProps {
  data: Record<string, unknown>;
  locale: string;
}

interface StepItem {
  _key: string;
  name: LocalizedStr;
  input: LocalizedStr;
  output: LocalizedStr;
}

export default function Process({ data, locale }: ProcessProps) {
  const anchorId = data.anchorId as string | undefined;
  const title = localizedValue(data.title as LocalizedStr, locale);
  const subtitle = localizedValue(data.subtitle as LocalizedStr, locale);
  const steps = data.steps as StepItem[] | undefined;

  return (
    <section id={anchorId} className="py-20 px-4 bg-base-200">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          {title && (
            <h2 className="rv rv-1 text-4xl md:text-5xl font-bold text-base-content mb-4">{title}</h2>
          )}
          <div className="rv rv-2 accent-divider" />
          {subtitle && (
            <p className="rv rv-2 text-lg text-base-content/70 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>
        <div className="space-y-6 rv-stagger">
          {steps?.map((step, idx) => (
            <div
              key={step._key}
              className="card bg-base-100 shadow-md border border-base-content/15 card-hover"
            >
              <div className="card-body flex-row items-start gap-6">
                <div className="shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-content text-lg font-bold shadow-lg">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-base-content mb-4">
                    {localizedValue(step.name, locale)}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-base-content/50 block mb-1.5">
                        {locale.startsWith("zh") ? "你提供" : locale === "fr" ? "Vous apportez" : "What you bring"}
                      </span>
                      <p className="text-base text-base-content/75 leading-relaxed">{localizedValue(step.input, locale)}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary block mb-1.5">
                        {locale.startsWith("zh") ? "你得到" : locale === "fr" ? "Vous obtenez" : "What you get"}
                      </span>
                      <p className="text-base text-base-content/95 leading-relaxed">{localizedValue(step.output, locale)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
