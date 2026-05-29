"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 自定义下拉选择器，不使用 DaisyUI 原生 <select>。
 * 原因：DaisyUI 的 select 仅支持 value/label，不支持选项的 description（副标题）。
 * BaselineCalculator（活动量等级）与 ContactBooking（表单字段）依赖 options[].description 展示说明文案，
 * 故保留本实现。
 */

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
}

const TRIGGER_HEIGHT = "h-12"; // 48px
const TRIGGER_PX = "px-3.5";   // 14px
const ARROW_AREA_WIDTH = "w-10"; // 箭头区固定宽，文本不挤

export default function Select({
  value,
  onChange,
  options,
  placeholder = "—",
  name,
  required,
  disabled,
  id,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);
  const displayLabel = selected ? selected.label : placeholder;

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [open]);

  return (
    <div ref={rootRef} className="relative w-full">
      <input type="hidden" name={name} value={value} required={required} />
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={id ? `${id}-label` : undefined}
        className={`
          select-trigger ${TRIGGER_HEIGHT} ${TRIGGER_PX}
          w-full flex items-center justify-between gap-2
          text-left text-base-content
          hover:bg-base-200/80
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors
        `}
      >
        <span className="min-w-0 flex-1 truncate">
          <span className={selected ? "font-medium text-base-content" : "text-base-content/45 font-normal"}>{displayLabel}</span>
        </span>
        <span className={`${ARROW_AREA_WIDTH} shrink-0 flex items-center justify-center text-base-content/50 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="select-dropdown absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-auto rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.25)] py-1"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li key={opt.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`
                    w-full text-left px-3 py-2.5 flex items-start gap-3
                    border-l-2 border-transparent
                    hover:bg-base-content/10
                    transition-colors
                    ${isSelected ? "border-l-primary text-white bg-base-content/10" : ""}
                  `}
                >
                  <span className="min-w-0 flex-1">
                    <span className={`block ${isSelected ? "font-medium text-white" : "font-medium text-base-content"}`}>
                      {opt.label}
                    </span>
                    {opt.description && (
                      <span className={`block text-sm mt-0.5 ${isSelected ? "text-white/80" : "text-base-content/60"}`}>
                        {opt.description}
                      </span>
                    )}
                  </span>
                  {isSelected && (
                    <span className="shrink-0 text-primary" aria-hidden>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
