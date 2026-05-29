import { localizedValue, type LocalizedStr } from "@/lib/sanity/localizedValue";

interface ProofProps {
  data: Record<string, unknown>;
  locale: string;
}

interface CaseItem {
  _key: string;
  context: LocalizedStr;
  goal: LocalizedStr;
  timeframe: LocalizedStr;
  metrics: LocalizedStr;
  quote: LocalizedStr;
  name: LocalizedStr;
}

export default function Proof({ data, locale }: ProofProps) {
  const anchorId = data.anchorId as string | undefined;
  const title = localizedValue(data.title as LocalizedStr, locale);
  const items = data.items as CaseItem[] | undefined;

  return (
    <section id={anchorId} className="py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          {title && (
            <h2 className="rv rv-1 text-4xl md:text-5xl font-bold mb-4">{title}</h2>
          )}
          <div className="rv rv-2 accent-divider" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 rv-stagger">
          {items?.map((item) => {
            const context = localizedValue(item.context, locale);
            const goal = localizedValue(item.goal, locale);
            const timeframe = localizedValue(item.timeframe, locale);
            const metrics = localizedValue(item.metrics, locale);
            const quote = localizedValue(item.quote, locale);
            const name = localizedValue(item.name, locale);

            return (
              <div key={item._key} className="card bg-base-100 shadow-lg border border-base-content/15 card-hover">
                <div className="card-body">
                  <div className="text-xs text-base-content/70 mb-1">{context}</div>
                  <h3 className="card-title text-lg mb-2">{goal}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="badge badge-outline badge-sm">{timeframe}</span>
                  </div>
                  <p className="text-sm font-semibold text-primary mb-4">{metrics}</p>
                  <blockquote className="text-base-content/90 italic border-l-4 border-primary pl-4 mb-4">
                    &ldquo;{quote}&rdquo;
                  </blockquote>
                  <p className="text-sm font-bold text-right">— {name}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
