/**
 * Sanity Studio 环境变量（Vite 构建自动暴露 SANITY_STUDIO_*）
 * 根目录 .env.local 存放实际值
 */
export const projectId = process.env.SANITY_STUDIO_PROJECT_ID!;
export const dataset = process.env.SANITY_STUDIO_DATASET || "production";
