"use client";

import { useState, useEffect } from "react";
import { localizedValue, type LocalizedStr } from "@/lib/sanity/localizedValue";

interface SplashOverlayProps {
  quotes?: Array<{ _key: string; text: LocalizedStr }>;
  locale: string;
}

export default function SplashOverlay({ quotes, locale }: SplashOverlayProps) {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  // SSR 固定取第 0 条以避免 hydration mismatch，挂载后随机化
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    if (quotes && quotes.length > 1) {
      setQuoteIndex(Math.floor(Math.random() * quotes.length));
    }
    const fadeTimer = setTimeout(() => setFadeOut(true), 2000);
    const hideTimer = setTimeout(() => setVisible(false), 2500);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [quotes]);

  const randomQuote = quotes && quotes.length > 0 ? quotes[quoteIndex] : null;
  const quoteText = randomQuote ? localizedValue(randomQuote.text, locale) : null;

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] bg-base-100 flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="max-w-2xl px-6 text-center animate-[fadeInUp_0.8s_ease-out]">
        {quoteText ? (
          <p className="text-xl md:text-2xl font-medium text-base-content/80 leading-relaxed">
            {quoteText}
          </p>
        ) : (
          <p className="text-xl md:text-2xl font-medium text-base-content/80 leading-relaxed">
            {locale.startsWith("zh") ? "加载中..." : "Loading..."}
          </p>
        )}
      </div>
    </div>
  );
}
