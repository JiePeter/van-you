"use client";

import { useRef, useCallback } from "react";

interface PortableBlock {
  _type?: string;
  style?: string;
  children?: Array<{ text?: string }>;
}

interface FooterModalLinkProps {
  label: string;
  title: string;
  blocks: PortableBlock[];
}

function renderBlock(block: PortableBlock, idx: number) {
  const text = block.children?.map((c) => c?.text ?? "").join("") ?? "";
  if (!text) return null;

  switch (block.style) {
    case "h2":
      return <h3 key={idx} className="text-lg font-bold mt-6 mb-2">{text}</h3>;
    case "h3":
      return <h4 key={idx} className="text-base font-semibold mt-4 mb-1">{text}</h4>;
    case "h4":
      return <h5 key={idx} className="text-sm font-semibold mt-3 mb-1">{text}</h5>;
    case "blockquote":
      return <blockquote key={idx} className="border-l-4 border-base-300 pl-4 italic my-2 opacity-70">{text}</blockquote>;
    default:
      return <p key={idx} className="leading-relaxed mb-3">{text}</p>;
  }
}

export default function FooterModalLink({ label, title, blocks }: FooterModalLinkProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openModal = useCallback(() => {
    dialogRef.current?.showModal();
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="link link-hover text-sm text-left"
      >
        {label}
      </button>

      {/* 强制 bg-base-100 text-base-content 重置 footer 继承的淡色文字 */}
      <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-base-100 text-base-content max-w-2xl flex flex-col p-0 max-h-[80vh]">
          {/* 固定页头：标题 + 关闭按钮 */}
          <div className="sticky top-0 z-10 bg-base-100 border-b border-base-300 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">{title}</h2>
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost text-base-content/60 hover:text-base-content">✕</button>
            </form>
          </div>

          {/* 可滚动内容区 */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {blocks.map((block, idx) => renderBlock(block, idx))}
          </div>
        </div>

        {/* 点击遮罩层关闭 */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
