# 部署到 Cloudflare（Workers + OpenNext）操作手册

> 适用：本仓库 `nextjs-vanyou`（Next.js 16.1.x App Router + next-intl + Sanity）。
> 现状：**主部署目标暂定 Vercel**；本手册是 Cloudflare 备选路径的完整操作流程。
> 适配器：`@opennextjs/cloudflare`（OpenNext，Cloudflare 官方现行的 Next.js 路径，非旧的 `next-on-pages`）。
> 最近更新：2026-06-13。

---

## 0. 为什么走 OpenNext（不是 next-on-pages / Pages）
本站用到 **middleware（`src/proxy.ts`，Next16 重命名）、Server Action、ISR**，这些需要在 Worker 里跑完整 Next 运行时。OpenNext Cloudflare：
- 跑在 **Cloudflare Workers + Static Assets**，Node.js 兼容（`nodejs_compat`）；
- 支持 SSR / **ISR（用 R2 做增量缓存）** / middleware / Server Action / Image；
- 已支持 **Next.js 16 全部 minor/patch**。

## 1. 本站需要的适配点（核对清单）
| 特性 | 代码位置 | Cloudflare 适配 |
|---|---|---|
| middleware | `src/proxy.ts`（next-intl + `node:crypto.randomBytes`） | **必须开 `nodejs_compat`**，无需改码 |
| ISR | `src/app/[locale]/layout.tsx` & `page.tsx` 的 `revalidate=60` + `generateStaticParams` | OpenNext 用 **R2** 增量缓存 |
| Server Action | `src/app/actions/submitConsult.ts`（`cookies()` + Resend fetch + `process.env`） | nodejs_compat 下 OK，无需改码 |
| `next/image` | 远程 `cdn.sanity.io` / `images.unsplash.com` | Cloudflare 无内置优化 → **`images.unoptimized: true`**（Sanity/Unsplash URL 已带尺寸参数） |
| env | `NEXT_PUBLIC_*` + `RESEND_API_KEY` 等 | public 变量构建期注入；密钥走 `wrangler secret` |

⚠️ **保持 Next 16.1.x**，先别升 16.2（16.2 的 deterministic build ID 与 R2 ISR + skew protection 有已知 bug）。

---

## 2. 阶段一：仓库内适配（纯本地，无需 Cloudflare 账号）

### 2.1 安装依赖
```bash
cd nextjs-vanyou
npm i -D @opennextjs/cloudflare wrangler
```

### 2.2 `wrangler.jsonc`（放 `nextjs-vanyou/` 根）
```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "vanyou",
  "main": ".open-next/worker.js",
  "compatibility_date": "2024-12-30",
  "compatibility_flags": ["nodejs_compat"],
  "assets": { "directory": ".open-next/assets", "binding": "ASSETS" },
  "r2_buckets": [
    { "binding": "NEXT_INC_CACHE_R2_BUCKET", "bucket_name": "vanyou-isr-cache" }
  ]
}
```

### 2.3 `open-next.config.ts`（放 `nextjs-vanyou/` 根）
```ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});
```

### 2.4 `next.config.ts` 增改
```ts
// 顶部
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev(); // 本地 next dev 也能拿到 CF 绑定

// nextConfig.images 增加：
images: {
  unoptimized: true, // Cloudflare 无 Vercel 图片优化层；依赖源站 URL 尺寸参数
  remotePatterns: [
    { protocol: "https", hostname: "cdn.sanity.io" },
    { protocol: "https", hostname: "images.unsplash.com" },
  ],
},
```

### 2.5 `package.json` 脚本
```json
"cf:preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
"cf:deploy":  "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
"cf:typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"
```

### 2.6 本地验证产物（仍无需账号）
```bash
npm run cf:preview   # 构建出 .open-next/ 并本地起 workerd 预览
```
> 验证：`.open-next/worker.js` 与 `.open-next/assets/` 生成；本地预览页面正常、`/en /zh` 200。

### 2.7 `.gitignore` 追加
```
.open-next/
.wrangler/
cloudflare-env.d.ts
```

---

## 3. 阶段二：Cloudflare 鉴权（你来，一次）
```bash
wrangler login   # 弹浏览器 OAuth；令牌存本机，后续命令复用
```
> `wrangler login` 是按用户全局的，目录无所谓；**不要把 API Token 贴进任何聊天/文件**。

## 4. 阶段三：建 R2 + 首次部署
```bash
cd nextjs-vanyou
wrangler r2 bucket create vanyou-isr-cache   # ISR 缓存桶（R2 免费 10GB）
npm run cf:deploy                            # 构建 + 部署到 *.workers.dev
```
> 部署后访问 `https://vanyou.<account>.workers.dev` 验证。

## 5. 阶段四：环境变量 / 密钥
public 变量（构建期注入，可放 `wrangler.jsonc` 的 `vars` 或 CI 构建环境）：
```
NEXT_PUBLIC_PROJECT_ID=swlg6klq
NEXT_PUBLIC_DATASET=production
NEXT_PUBLIC_PROJECT_NAME=VANYOU Cargo Solutions Inc.
NEXT_PUBLIC_PROJECT_DESCRIPTION=Warehouse & logistics services, Vancouver
CONTACT_TO_EMAIL=Tony.chiu@vanyoucargo.com
NEXT_PUBLIC_SITE_URL=https://vanyoucargo.com
```
密钥（**不进仓库、不进聊天**）：
```bash
wrangler secret put RESEND_API_KEY   # 交互输入
```

## 6. 阶段五：自定义域（Cloudflare）
Workers → 你的 Worker → **Settings → Domains & Routes → Add Custom Domain** → `vanyoucargo.com`（和 `www`）。
Cloudflare 自动建 DNS + 证书，无需手填 A/CNAME，也不用纠结橙云/灰云。

## 7. 阶段六：邮件发信 DNS（让联系表单真能发）
1. Resend 验证发信域（`vanyoucargo.com` 或子域 `send.vanyoucargo.com`）；
2. 在 Cloudflare DNS 加 Resend 给的 **SPF(TXT) / DKIM(CNAME或TXT) / DMARC(TXT)**（子域还有 MX），全部 **DNS only（灰云）**；
3. 改 `src/app/actions/submitConsult.ts` 的 `from` 为验证域地址；
4. 确认 `RESEND_API_KEY` secret 已设。
> 现状：`from` 还是沙盒 `onboarding@resend.dev` 且 key 为空 → 表单发不出,务必在上线前完成本步。

---

## 8. 成本
Workers 免费（10 万请求/天）+ R2 免费（10GB）+ 静态无限 → **本站流量下 $0**，且无 Vercel Hobby 的商业用途限制。
触发付费的唯一现实情形：日 Function 请求超 10 万 → Workers Paid $5/月。

## 9. 维护
- 改代码/内容后重新部署：`cd nextjs-vanyou && npm run cf:deploy`
- Sanity 数据同步：`cd nextjs-vanyou && npm run export-ndjson` → `cd ../studio-vanyou && npx sanity dataset import ../seed.ndjson production --replace`

## 10. 排错 / 已知坑
- **`proxy.ts` 报 crypto 不可用** → 确认 `compatibility_flags=["nodejs_compat"]` 且 `compatibility_date ≥ 2024-09-23`。
- **图片 404 / 不显示** → 确认 `images.unoptimized: true` 且 `remotePatterns` 含源站域名。
- **ISR 不更新 / 重部署后样式丢** → 别升 Next 16.2、别开 Workers skew protection 预览特性；增量缓存桶绑定名须为 `NEXT_INC_CACHE_R2_BUCKET`。
- **构建找不到 tailwindcss（monorepo）** → `next.config.ts` 已有 `turbopack.resolveAlias` 指向本包；OpenNext 走 `next build`，若仍报错检查 `turbopack.root`。

## 参考
- OpenNext Cloudflare：https://opennext.js.org/cloudflare
- Cloudflare 官方 Next.js 指南：https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
