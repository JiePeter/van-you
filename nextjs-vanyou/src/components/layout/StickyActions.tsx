"use client";

import { useState, useEffect } from "react";

interface StickyActionsProps {
  locale: string;
  bookingAnchor?: string;
  calculatorAnchor?: string;
}

export default function StickyActions({
  locale,
  bookingAnchor = "contact",
  calculatorAnchor = "calculator",
}: StickyActionsProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.5);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isZh = locale.startsWith("zh");

  // 仅 Hero 内不显示；离开 Hero 后始终显示
  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 animate-[scaleIn_0.3s_ease-out]">
      <a
        href={`#${calculatorAnchor}`}
        className="btn btn-circle btn-lg btn-accent text-accent-content"
        aria-label={isZh ? "计算器" : "Calculator"}
        title={isZh ? "基础计算器" : "Baseline Calculator"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      </a>
      <a
        href={`#${bookingAnchor}`}
        className="btn btn-circle btn-lg btn-primary"
        aria-label={isZh ? "预约" : "Book"}
        title={isZh ? "预约咨询" : "Book Consultation"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </a>
    </div>
  );
}
