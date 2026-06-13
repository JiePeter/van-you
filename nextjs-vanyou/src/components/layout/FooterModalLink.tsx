"use client";

import { useRef, useCallback } from "react";

interface FooterModalLinkProps {
  label: string;
  /** 纯文本正文，按空行（\n\n）拆段渲染 */
  body: string;
}

export default function FooterModalLink({ label, body }: FooterModalLinkProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openModal = useCallback(() => dialogRef.current?.showModal(), []);

  const paragraphs = body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="cursor-pointer text-sm text-neutral-content/70 hover:text-neutral-content underline underline-offset-2 decoration-neutral-content/20 hover:decoration-neutral-content/60 transition-colors"
      >
        {label}
      </button>

      <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-base-100 text-base-content max-w-2xl flex flex-col p-0 max-h-[80vh]">
          {/* 固定页头：标题 + 关闭 */}
          <div className="sticky top-0 z-10 bg-base-100 border-b border-base-300 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">{label}</h2>
            <form method="dialog">
              <button
                className="btn btn-sm btn-circle btn-ghost text-base-content/60 hover:text-base-content"
                aria-label="Close"
              >
                ✕
              </button>
            </form>
          </div>

          {/* 可滚动正文 */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {paragraphs.map((p, i) => (
              <p key={i} className="leading-relaxed mb-3 text-sm text-base-content/85">
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* 点击遮罩关闭 */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
