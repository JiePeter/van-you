// link schema 解析：external 用 url；internal 无 internalRef 时用 #anchor 同页锚点，有 internalRef 时用路径
interface LinkData {
  type?: string;
  url?: string;
  anchor?: string;
  internalRef?: { _ref?: string };
  openInNewTab?: boolean;
}

export interface ResolvedLink {
  href: string;
  target?: string;
  rel?: string;
}

/** 是否为同页锚点（仅 anchor，无 internalRef），应使用 #id 滚动 */
function isSamePageAnchor(link: LinkData): boolean {
  return link.type === "internal" && !!link.anchor && !link.internalRef?._ref;
}

export function resolveLink(link: LinkData | undefined | null): ResolvedLink {
  if (!link) return { href: "#" };

  if (link.type === "external" && link.url) {
    return {
      href: link.url,
      target: link.openInNewTab ? "_blank" : undefined,
      rel: link.openInNewTab ? "noopener noreferrer" : undefined,
    };
  }

  // 同页锚点：仅 anchor，无页面引用 → #id 滚动
  if (isSamePageAnchor(link)) {
    return { href: `#${link.anchor}` };
  }

  // 内部链接：指向其他页面时 anchor 作为路径段（internalRef 解析由调用方或后续实现）
  const href = link.anchor ? `/${link.anchor}` : "/";
  return { href };
}
