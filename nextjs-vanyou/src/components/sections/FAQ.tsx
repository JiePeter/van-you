"use client";

import { useState, useEffect } from "react";
import { localizedValue, type LocalizedStr } from "@/lib/sanity/localizedValue";

interface FAQProps {
  data: Record<string, unknown>;
  locale: string;
}

interface FAQItem {
  _key: string;
  question: LocalizedStr;
  answer: LocalizedStr;
}

/** 移动端/触摸设备下使用瞬间展开，避免 grid 高度过渡导致的 reflow 卡顿 */
const FAQ_MAX_HEIGHT = "500px";

export default function FAQ({ data, locale }: FAQProps) {
  const anchorId = data.anchorId as string | undefined;
  const title = localizedValue(data.title as LocalizedStr, locale);
  const items = data.items as FAQItem[] | undefined;

  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [preferInstantExpand, setPreferInstantExpand] = useState(false);

  useEffect(() => {
    const isTouch =
      "ontouchstart" in window || window.matchMedia("(pointer: coarse)").matches;
    setPreferInstantExpand(isTouch);
  }, []);

  return (
    <section id={anchorId} className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          {title && (
            <h2 className="rv rv-1 text-4xl md:text-5xl font-bold mb-4">
              {title}
            </h2>
          )}
          <div className="rv rv-2 accent-divider" />
        </div>
        <div className="space-y-3 rv-stagger">
          {items?.map((item, idx) => {
            const question = localizedValue(item.question, locale);
            const answer = localizedValue(item.answer, locale);
            const isOpen = openIdx === idx;

            return (
              <div
                key={item._key}
                className="faq-accordion-item bg-base-100 shadow border border-base-content/15 card-hover rounded-box overflow-hidden"
                data-open={isOpen}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="faq-accordion-trigger w-full text-left flex items-center gap-3 px-4 py-4 min-h-14"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item._key}`}
                  id={`faq-question-${item._key}`}
                >
                  <span
                    className="faq-accordion-icon shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-base-content/10 text-base-content/70"
                    aria-hidden
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                  <span className="text-lg font-semibold flex-1">{question}</span>
                </button>
                {preferInstantExpand ? (
                  <div
                    id={`faq-answer-${item._key}`}
                    role="region"
                    aria-labelledby={`faq-question-${item._key}`}
                    className="faq-accordion-content overflow-hidden"
                    style={{
                      maxHeight: isOpen ? FAQ_MAX_HEIGHT : "0",
                      transition: "none",
                    }}
                  >
                    <div className="pt-0 pb-4 px-4">
                      <p className="text-base-content/90 leading-relaxed">{answer}</p>
                    </div>
                  </div>
                ) : (
                  <div
                    id={`faq-answer-${item._key}`}
                    role="region"
                    aria-labelledby={`faq-question-${item._key}`}
                    className={`grid transition-[grid-template-rows] duration-300 ease-out faq-accordion-content ${!isOpen ? "faq-leave-delay" : ""}`}
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="pt-0 pb-4 px-4">
                        <p className="text-base-content/90 leading-relaxed">{answer}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
