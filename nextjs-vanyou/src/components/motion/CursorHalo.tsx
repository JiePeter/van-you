"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 全局指针跟随光晕：radial gradient 跟随鼠标移动，
 * 靠近交互元素时增强强度。
 * 移动端（触摸/粗指针）与 reduced-motion 下不挂载，避免多余 DOM 与样式。
 */
function useCanShowHalo() {
  const [canShow, setCanShow] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if ("ontouchstart" in window || window.matchMedia("(pointer: coarse)").matches) return;
    setCanShow(true);
  }, []);
  return canShow;
}

export default function CursorHalo() {
  const canShow = useCanShowHalo();
  const haloRef = useRef<HTMLDivElement>(null);
  // 依赖数组固定为 [canShow, undefined]，避免“依赖项数量在渲染间变化”的 React 警告
  const deps = [canShow, undefined] as const;

  useEffect(() => {
    if (!deps[0]) return;

    const halo = haloRef.current;
    if (!halo) return;

    let raf: number;
    let mx = -200;
    let my = -200;
    let cx = -200;
    let cy = -200;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      // 靠近可交互元素时增强
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, input, select, textarea, [role='button']");
      halo.style.setProperty("--halo-scale", interactive ? "1.5" : "1");
      halo.style.setProperty("--halo-opacity", interactive ? "0.18" : "0.08");
    };

    const tick = () => {
      cx += (mx - cx) * 0.15;
      cy += (my - cy) * 0.15;
      halo.style.transform = `translate(${cx - 96}px, ${cy - 96}px) scale(var(--halo-scale, 1))`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, deps);

  if (!canShow) return null;

  return (
    <div
      ref={haloRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-9999 h-48 w-48 rounded-full mix-blend-screen transition-opacity duration-300"
      style={{
        background: "radial-gradient(circle, oklch(0.72 0.19 150 / var(--halo-opacity, 0.08)) 0%, transparent 70%)",
        willChange: "transform",
      }}
    />
  );
}
