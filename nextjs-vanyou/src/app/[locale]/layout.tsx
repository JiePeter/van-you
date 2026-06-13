import { hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

// ISR：边缘缓存 60s，过期后后台增量再生
export const revalidate = 60;
import { Inter, Space_Grotesk } from "next/font/google";
import { fetchSanityData } from "@/lib/sanity/fetch";
import { navigationQuery, siteSettingsQuery } from "@/lib/sanity/queries";
import { resolveLocalizedImage } from "@/lib/sanity/resolveImage";
import { ContactInViewProvider } from "@/context/ContactInViewContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const navigation = await fetchSanityData<Record<string, unknown>>(navigationQuery, "navigation");
  const siteSettings = await fetchSanityData<Record<string, unknown>>(siteSettingsQuery, "siteSettings");

  // 服务端解析 logo 图片 URL，传给客户端 Header
  const logo = resolveLocalizedImage(
    siteSettings.logo as Record<string, unknown> | undefined,
    locale,
    160
  );
  const logoRounded = (siteSettings.logoRounded as boolean) ?? false;
  const enabledLocales = (siteSettings.enabledLocales as string[] | undefined) ?? routing.locales as unknown as string[];

  return (
    <html lang={locale} data-theme="vanyou-light">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        {/* 中文/繁中装饰用免费楷体 LXGW 霞鹜文楷（简繁通吃，OFL）；仅在 zh 语言加载，按字形分块下载 */}
        {locale.startsWith("zh") && (
          <>
            <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
            <link
              href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont/style.css"
              rel="stylesheet"
            />
          </>
        )}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-100 focus:p-4 focus:bg-primary focus:text-primary-content">
          Skip to content
        </a>
        <NextIntlClientProvider messages={messages}>
          <ContactInViewProvider>
            <Header
              navigation={navigation}
              siteSettings={siteSettings}
              locale={locale}
              logoUrl={logo?.src}
              logoAlt={logo?.alt}
              logoRounded={logoRounded}
              enabledLocales={enabledLocales}
            />
            <main id="main-content">{children}</main>
            <Footer />
          </ContactInViewProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
