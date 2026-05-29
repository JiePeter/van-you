"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  /** 完全跳过动画（Hero 等沉浸式区块） */
  immediate?: boolean;
}

/**
 * 渐进增强 Reveal：默认内容可见，仅对桌面端「不在视口内」的 section 注入 .rv-ready，
 * IO 命中时加 .section-revealed 触发入场动画。触摸/减动效/已在视口内则不加 .rv-ready，内容始终可见。
 */
function isInViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  const margin = 60;
  return rect.top < window.innerHeight - margin && rect.bottom > margin;
}

export default function RevealOnScroll({ children, className = "", immediate = false }: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(immediate);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (immediate) return;
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setRevealed(true);
      return;
    }

    const isTouch =
      "ontouchstart" in window || window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) {
      setRevealed(true);
      return;
    }

    if (isInViewport(el)) {
      setRevealed(true);
      return;
    }

    setReady(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [immediate]);

  const rootClass = [ready && "rv-ready", revealed && "section-revealed", className].filter(Boolean).join(" ");

  return (
    <div ref={ref} className={rootClass}>
      {children}
    </div>
  );
}
