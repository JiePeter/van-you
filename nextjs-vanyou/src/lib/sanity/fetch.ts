import { client } from "./client";
import { mockData } from "./mockData";
import { getLastGood, setLastGood } from "./lastGoodCache";
import type { MockDocType } from "@/types/sanity";

// 回退链：Sanity API → last-good 持久化 → mockData
export async function fetchSanityData<T>(
  query: string,
  docType: MockDocType
): Promise<T> {
  // 未配置 Sanity 时直接用 mockData（本地开发 / 接入 Sanity 前）
  if (client) {
    try {
      const data = await client.fetch<T | null>(query);
      if (data) {
        await setLastGood(docType, data);
        return data;
      }
    } catch (error) {
      console.error(`Failed to fetch ${docType}`, { error });
    }
    const lastGood = await getLastGood<T>(docType);
    if (lastGood) return lastGood;
  }
  return mockData[docType] as unknown as T;
}
