"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const COUNTDOWN_SECONDS = 10;

/** 根级 404 使用：无 i18n 上下文，倒计时后跳转到指定路径 */
export default function CountdownRedirect({
  redirectPath,
  label = "Redirecting in {seconds}s",
}: {
  redirectPath: string;
  label?: string;
}) {
  const router = useRouter();
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    if (seconds <= 0) {
      router.replace(redirectPath);
      return;
    }
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds, redirectPath, router]);

  return (
    <p className="mt-2 text-sm opacity-60">
      {label.replace("{seconds}", String(seconds))}
    </p>
  );
}
