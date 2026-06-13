"use client";

import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import { useState, useEffect, useCallback } from "react";
import { localizedValue, type LocalizedStr } from "@/lib/sanity/localizedValue";
import { resolveLink, type ResolvedLink } from "@/lib/sanity/resolveLink";
import LanguageSwitcher from "./LanguageSwitcher";

interface HeaderMenuItem {
  label?: LocalizedStr;
  link?: Record<string, unknown>;
}

interface HeaderProps {
  navigation: { headerMenu?: HeaderMenuItem[] };
  siteSettings: {
    siteName?: LocalizedStr;
    siteShortName?: LocalizedStr;
    promoBar?: {
      enabled?: boolean;
      text?: LocalizedStr;
      link?: Record<string, unknown>;
    };
  };
  locale: string;
  logoUrl?: string;
  logoAlt?: string;
  logoRounded?: boolean;
  enabledLocales?: string[];
}

export default function Header({ navigation, siteSettings, locale, logoUrl, logoAlt, logoRounded, enabledLocales }: HeaderProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const siteName = localizedValue(siteSettings.siteName, locale) ?? process.env.NEXT_PUBLIC_PROJECT_NAME ?? "VANYOU";
  // 导航/抽屉品牌名用可配置简称，避免长名在窄屏挤占；留空回退 "VANYOU"
  const brandName = localizedValue(siteSettings.siteShortName, locale) ?? "VANYOU";
  const headerMenu = navigation.headerMenu ?? [];
  const promoBar = siteSettings.promoBar;

  const navLinks = headerMenu.map((item) => {
    const resolved = resolveLink(item.link);
    return {
      href: resolved.href,
      label: localizedValue(item.label, locale) ?? "",
      target: resolved.target,
      rel: resolved.rel,
    };
  });

  const isExternal = (link: ResolvedLink) => !!link.target;
  /** 同页锚点用 <a> 以触发原生滚动，避免 Link 做路由跳转 */
  const isHashLink = (href: string) => href.startsWith("#");

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // 抽屉打开时锁定 body 滚动
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      {promoBar?.enabled && promoBar.text && (
        <PromoBar text={promoBar.text} link={promoBar.link} locale={locale} />
      )}

      <nav
        aria-label="Main navigation"
        className="navbar navbar--compact sticky top-0 z-50 bg-base-100/90 backdrop-blur-md text-base-content border-b border-base-content/10 shadow-sm"
      >
        <div className="navbar-start">
          <Link href="/" className="navbar-logo-link inline-flex items-center px-1.5 py-1">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={logoAlt ?? siteName}
                width={72}
                height={48}
                className={`navbar-logo-img object-contain${logoRounded ? " rounded-full" : ""}`}
              />
            ) : (
              <span className="navbar-logo-emoji font-heading font-black">V</span>
            )}
            <span className="font-heading navbar-site-name">
              {/* 移动端用简称避免挤占，桌面端保持原全名 */}
              <span className="md:hidden">{brandName}</span>
              <span className="hidden md:inline">{siteName}</span>
            </span>
          </Link>
        </div>

        {/* 桌面端导航 */}
        <div className="navbar-center hidden md:flex">
          <ul className="menu menu-horizontal gap-1 px-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                {isExternal(link) ? (
                  <a href={link.href} target={link.target} rel={link.rel}>
                    {link.label}
                  </a>
                ) : isHashLink(link.href) ? (
                  <a href={link.href}>{link.label}</a>
                ) : (
                  <Link
                    href={link.href}
                    className={pathname === link.href ? "active" : ""}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="navbar-end gap-2">
          {/* 桌面端语言切换 */}
          <div className="hidden md:flex">
            <LanguageSwitcher enabledLocales={enabledLocales} />
          </div>

          {/* 移动端汉堡按钮 */}
          <button
            className="btn btn-ghost md:hidden"
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* ── 移动端侧滑抽屉 ── */}
      <div
        className={`fixed inset-0 z-100 md:hidden transition-visibility ${
          drawerOpen ? "visible" : "invisible delay-300"
        }`}
        aria-modal={drawerOpen}
        role="dialog"
      >
        {/* 半透明遮罩：点击关闭 */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
            drawerOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeDrawer}
          aria-hidden="true"
        />

        {/* 抽屉面板：右侧滑入 */}
        <aside
          className={`absolute right-0 top-0 h-full w-64 max-w-[75vw] bg-base-100 text-base-content shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* 抽屉头部 */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-base-content/10 shrink-0">
            <span className="font-heading font-semibold text-lg tracking-tight">{brandName}</span>
            <button
              onClick={closeDrawer}
              className="btn btn-ghost btn-sm btn-circle"
              aria-label="Close menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 导航链接：与顶栏一致，全大写 + 字间距 */}
          <ul className="menu navbar-drawer-menu gap-0.5 px-3 py-4 flex-1 overflow-y-auto">
            {navLinks.map((link) => (
              <li key={link.href}>
                {isExternal(link) ? (
                  <a
                    href={link.href}
                    target={link.target}
                    rel={link.rel}
                    onClick={closeDrawer}
                    className="py-3 text-base"
                  >
                    {link.label}
                  </a>
                ) : isHashLink(link.href) ? (
                  <a href={link.href} onClick={closeDrawer} className="py-3 text-base">
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    onClick={closeDrawer}
                    className={`py-3 text-base ${pathname === link.href ? "active" : ""}`}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* 底部：语言切换，独立层级 */}
          <div className="shrink-0 border-t border-base-content/10 px-5 py-4">
            <p className="text-xs opacity-40 mb-2.5 uppercase tracking-wider">Language</p>
            <LanguageSwitcher enabledLocales={enabledLocales} />
          </div>
        </aside>
      </div>
    </>
  );
}

function PromoBar({ text, link, locale }: { text: LocalizedStr; link?: Record<string, unknown>; locale: string }) {
  const content = localizedValue(text, locale);
  const resolved = resolveLink(link);
  if (!content) return null;

  return (
    <div className="bg-accent text-accent-content text-center py-2 text-sm">
      {resolved.href !== "#" ? (
        <a href={resolved.href} target={resolved.target} rel={resolved.rel} className="link link-hover font-medium">
          {content}
        </a>
      ) : (
        <span>{content}</span>
      )}
    </div>
  );
}
