import { redirect } from "next/navigation";
import { defaultLocale } from "@/i18n/config";

// 根路径兜底重定向：Next 16 的 proxy 中间件在 Vercel 上可能不执行，
// 此页保证访问 "/" 始终跳到默认语言，不再 404。
// 中间件正常执行时会先于本页拦截 "/" 并按 Accept-Language 协商语言。
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
