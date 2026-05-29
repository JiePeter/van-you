import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type { MockDocType } from "@/types/sanity";

// 持久化目录：Vercel 仅 /tmp 可写；自建 Node 用项目下目录；可通过 env 覆盖
const CACHE_DIR =
  process.env.SANITY_LAST_GOOD_DIR ||
  (process.env.VERCEL === "1" ? "/tmp/sanity-last-good" : path.join(process.cwd(), ".sanity-last-good"));

function cachePath(docType: MockDocType): string {
  return path.join(CACHE_DIR, `${docType}.json`);
}

/** 成功拉取后写入 last-good，供 Sanity 不可用时回退 */
export async function setLastGood<T>(docType: MockDocType, data: T): Promise<void> {
  try {
    await mkdir(CACHE_DIR, { recursive: true });
    await writeFile(cachePath(docType), JSON.stringify(data), "utf-8");
  } catch (err) {
    console.warn(`[lastGoodCache] Failed to persist ${docType}`, err);
  }
}

/** Sanity 失败时读取上次成功结果，无则返回 null */
export async function getLastGood<T>(docType: MockDocType): Promise<T | null> {
  try {
    const raw = await readFile(cachePath(docType), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
