"use client";

import { useRef, useEffect, type ReactNode } from "react";

interface ParallaxProps {
  children: ReactNode;
  /** 视差强度（0~0.4 较自然）。元素中心相对视口中心的位移 × -speed */
  speed?: number;
  /** 视口宽度 ≤ 此值时关闭视差，内容静止（移动端减负，默认 767 = Tailwind md 以下） */
  disableMaxWidth?: number;
  className?: string;
}

// 轻量滚动视差：用 rAF 节流，尊重 prefers-reduced-motion，移动端窄屏静止。容器通常需比内容略大并配合 overflow-hidden。
export default function Parallax({ children, speed = 0.16, disableMaxWidth = 767, className = "" }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      // 移动端窄屏：不做视差，复位 transform（旋转/缩放回桌面会自动恢复）
      if (window.innerWidth <= disableMaxWidth) {
        el.style.transform = "";
        return;
      }
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const offset = (center - window.innerHeight / 2) * -speed;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed, disableMaxWidth]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
