"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { localizedValue, type LocalizedStr } from "@/lib/sanity/localizedValue";
import { resolveLink } from "@/lib/sanity/resolveLink";
import { resolveLocalizedImage } from "@/lib/sanity/resolveImage";

interface HeroCarouselProps {
  data: Record<string, unknown>;
  locale: string;
}

const AUTOPLAY_MS = 6000;

export default function HeroCarousel({ data, locale }: HeroCarouselProps) {
  const anchorId = data.anchorId as string | undefined;
  const slides = (data.slides as Array<Record<string, unknown>>) ?? [];
  const count = slides.length;

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  // 用于重置文字入场动画的 key
  const [animKey, setAnimKey] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (idx: number) => {
      setCurrent(idx);
      setAnimKey((k) => k + 1);
    },
    [],
  );

  const next = useCallback(() => {
    goTo((current + 1) % count);
  }, [current, count, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + count) % count);
  }, [current, count, goTo]);

  // 自动轮播 + 进度条重置
  useEffect(() => {
    if (paused || count <= 1) return;

    // 重启进度条动画
    const bar = progressRef.current;
    if (bar) {
      bar.style.animation = "none";
      // 强制回流后重新启动动画
      void bar.offsetWidth;
      bar.style.animation = `slideProgress ${AUTOPLAY_MS}ms linear`;
    }

    const timer = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, count, next, current]);

  if (count === 0) return null;

  return (
    <div
      id={anchorId}
      className="relative min-h-[70vh] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* 幻灯片层：淡入淡出 + Ken Burns 背景缩放 */}
      {slides.map((slide, i) => {
        const bg = resolveLocalizedImage(
          slide.bgImage as Record<string, unknown> | undefined,
          locale,
          1920,
        );
        const title = localizedValue(
          slide.title as LocalizedStr,
          locale,
        );
        const subtitle = localizedValue(
          slide.subtitle as LocalizedStr,
          locale,
        );
        const ctaLabel = localizedValue(
          slide.ctaLabel as LocalizedStr,
          locale,
        );
        const link = resolveLink(
          slide.ctaLink as Record<string, unknown> | undefined,
        );
        const isActive = i === current;

        return (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            aria-hidden={!isActive}
          >
            {/* 背景：Ken Burns 缩放效果 */}
            <div className="absolute inset-0">
              {bg ? (
                <Image
                  src={bg.src}
                  alt={bg.alt}
                  fill
                  priority={i === 0}
                  className={`object-cover ${isActive ? "animate-[kenBurns_8s_ease-out_forwards]" : ""}`}
                />
              ) : (
                <div className={`absolute inset-0 bg-linear-to-br from-primary/60 via-secondary/40 to-base-300 ${isActive ? "animate-[kenBurns_8s_ease-out_forwards]" : ""}`} />
              )}
            </div>

            {/* 渐变叠加层：底部加深用于文字可读性 */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-black/10" />

            {/* 文字内容：滑入动画 */}
            <div className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center text-white">
              <div key={animKey} className="max-w-3xl">
                <h1
                  className="mb-5 text-4xl font-bold leading-tight drop-shadow-lg md:text-6xl lg:text-7xl"
                  style={{
                    animation: isActive ? "slideUp 0.8s ease-out both" : "none",
                  }}
                >
                  {title ?? "Welcome"}
                </h1>
                {subtitle && (
                  <p
                    className="mx-auto mb-8 max-w-xl text-lg opacity-90 drop-shadow md:text-xl"
                    style={{
                      animation: isActive
                        ? "slideUp 0.8s ease-out 0.15s both"
                        : "none",
                    }}
                  >
                    {subtitle}
                  </p>
                )}
                {ctaLabel && (
                  <div
                    style={{
                      animation: isActive
                        ? "slideUp 0.8s ease-out 0.3s both"
                        : "none",
                    }}
                  >
                    <a
                      href={link.href}
                      target={link.target}
                      rel={link.rel}
                      className="btn btn-primary btn-lg"
                    >
                      {ctaLabel}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* 左右切换按钮 */}
      {count > 1 && (
        <>
          <button
            onClick={prev}
            className="btn btn-circle btn-sm absolute left-4 top-1/2 z-20 -translate-y-1/2 border-0 bg-white/15 text-white backdrop-blur-sm hover:bg-white/30 md:btn-md"
            aria-label="Previous slide"
          >
            ❮
          </button>
          <button
            onClick={next}
            className="btn btn-circle btn-sm absolute right-4 top-1/2 z-20 -translate-y-1/2 border-0 bg-white/15 text-white backdrop-blur-sm hover:bg-white/30 md:btn-md"
            aria-label="Next slide"
          >
            ❯
          </button>
        </>
      )}

      {/* 底部：指示器 + 进度条 */}
      {count > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-20">
          {/* 指示器圆点 */}
          <div className="flex justify-center gap-2.5 pb-5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-8 bg-white"
                    : "w-2.5 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          {/* 进度条 */}
          <div className="h-1 bg-white/20">
            <div
              ref={progressRef}
              className="h-full bg-primary"
              style={{ animation: `slideProgress ${AUTOPLAY_MS}ms linear` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
