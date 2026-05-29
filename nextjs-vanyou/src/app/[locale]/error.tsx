"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

const COUNTDOWN_SECONDS = 10;

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  const t = useTranslations("Common");
  const router = useRouter();
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    if (seconds <= 0) {
      router.replace("/");
      return;
    }
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="container mx-auto max-w-xl text-center">
        <h1 className="text-4xl font-bold text-error">Oops!</h1>
        <p className="mt-4 text-lg opacity-70">{t("error")}</p>
        <p className="mt-2 text-sm opacity-60">
          {t("redirectInSeconds", { seconds })}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button onClick={reset} className="btn btn-primary">
            {t("tryAgain")}
          </button>
          <button
            onClick={() => router.replace("/")}
            className="btn btn-ghost"
          >
            {t("backToHome")}
          </button>
        </div>
      </div>
    </div>
  );
}
