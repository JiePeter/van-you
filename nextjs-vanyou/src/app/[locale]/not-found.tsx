"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

const COUNTDOWN_SECONDS = 10;

export default function NotFound() {
  const t = useTranslations("Common");
  const tNotFound = useTranslations("NotFound");
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
        <h1 className="text-6xl font-bold text-primary">{tNotFound("title")}</h1>
        <p className="mt-4 text-lg opacity-70">{tNotFound("message")}</p>
        <p className="mt-2 text-sm opacity-60">
          {t("redirectInSeconds", { seconds })}
        </p>
        <button
          onClick={() => router.replace("/")}
          className="btn btn-primary mt-6"
        >
          {t("backToHome")}
        </button>
      </div>
    </div>
  );
}
