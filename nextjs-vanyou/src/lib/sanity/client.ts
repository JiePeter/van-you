import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_DATASET;

// 未配置 Sanity（projectId 缺失）时为 null：fetch 层将回退到 mockData。
// 接入 Sanity 后，在 .env.local 填入 NEXT_PUBLIC_PROJECT_ID / DATASET 即可自动启用。
export const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: "2024-01-01",
      useCdn: false,
    })
  : null;
