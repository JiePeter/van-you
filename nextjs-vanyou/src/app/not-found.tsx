import Link from "next/link";
import { defaultLocale } from "@/i18n/config";
import CountdownRedirect from "@/components/CountdownRedirect";

export default function RootNotFound() {
  const homeHref = `/${defaultLocale}`;
  return (
    <html lang={defaultLocale} data-theme="vanyou">
      <body className="flex min-h-screen items-center justify-center font-sans antialiased">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <p className="mt-4 text-lg opacity-70">Page not found</p>
          <CountdownRedirect
            redirectPath={homeHref}
            label="Redirecting in {seconds}s"
          />
          <Link href={homeHref} className="btn btn-primary mt-6 inline-block">
            Back to Home
          </Link>
        </div>
      </body>
    </html>
  );
}
