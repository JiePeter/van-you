# 部署手册（VANYOU）

> 适用：本仓库 `nextjs-vanyou`（Next.js 16.1.x App Router + next-intl + Sanity）。
> **当前线上路径：Vercel**（Part 1）。**备选：Cloudflare Workers + OpenNext**（Part 3，未实际部署）。
> 邮件发信（Resend）与托管平台无关，见 Part 2。
> 最近更新：2026-06-13。

---

# Part 1 · Vercel 部署（当前线上路径）

GitHub 远端 `JiePeter/van-you`，monorepo（`nextjs-vanyou/` 应用 + `studio-vanyou/` Sanity）。Vercel 连 GitHub，push 到 `master` 即自动构建部署。

## 1.1 创建项目（Vercel 面板，一次性）
1. vercel.com → New Project → Import `JiePeter/van-you`。
2. **Root Directory 必须设为 `nextjs-vanyou`**（monorepo 关键；否则在仓库根找不到 `package.json`）。框架自动识别 Next.js。

## 1.2 包管理器坑（已修，记录备查）
- `nextjs-vanyou` 实际用 **npm（`package-lock.json`）**。
- 仓库曾同时存在一个 **3 月的陈旧 `pnpm-lock.yaml`**；Vercel 见到它就改用 pnpm，并因 `--frozen-lockfile` 与 `package.json` 对不上而失败（`ERR_PNPM_OUTDATED_LOCKFILE`），构建停在 "Installing dependencies..."。
- **修法**：删掉 `nextjs-vanyou/pnpm-lock.yaml`（已删，commit `cb25e20`），只保留 `package-lock.json` → Vercel 自动用 npm。
- 规则：**别让两个锁文件并存**；`studio-vanyou` 的 pnpm-lock 不影响（它不部署到 Vercel）。

## 1.3 环境变量（Vercel → Settings → Environment Variables）
public（构建期注入浏览器，非密钥）：
```
NEXT_PUBLIC_PROJECT_ID=swlg6klq
NEXT_PUBLIC_DATASET=production
NEXT_PUBLIC_PROJECT_NAME=VANYOU Cargo Solutions Inc.
NEXT_PUBLIC_PROJECT_DESCRIPTION=Warehouse & logistics services, Vancouver
NEXT_PUBLIC_SITE_URL=https://vanyoucargo.com
```
服务端密钥（**不加 `NEXT_PUBLIC_` 前缀就不会暴露给访问者**，面板填、不进仓库）：
```
RESEND_API_KEY=（Resend 控制台获取）
CONTACT_TO_EMAIL=（收询盘的邮箱，见 Part 2）
```
> 一个 env 都不填也能部署成功（站点回退 mock 数据）；填了才从 Sanity 取数 / 发邮件。

## 1.4 部署与验证
push `master` → 自动构建 → `*.vercel.app`。验证 `/`（应跳默认语言）、`/en` `/zh` `/zh-Hant` `/fr` 均 200；提交一次联系表单确认收信。

## 1.5 绑定域名
Vercel → Settings → Domains → 加 `vanyoucargo.com`（和 `www`）→ 按 Vercel 给的 DNS 记录到域名 DNS（Cloudflare）添加；证书自动。

## 1.6 注意
- **Vercel 免费 Hobby 禁商业用途**，公司站严格说需 **Pro（$20/月）**；测试用 Hobby，正式商用再升级或转 Cloudflare（Part 3）。
- 重新部署 = push 到 `master`（或面板 Redeploy）。

---

# Part 2 · 邮件发信（Resend，与托管平台无关）

逻辑在 [`src/app/actions/submitConsult.ts`](../src/app/actions/submitConsult.ts) 的 `sendEmailNotification`：
- **收件人 = `CONTACT_TO_EMAIL`**（不是提交者）；未设则跳过发信（仅 `console.warn`）。
- **`from`** 当前写死 `... <onboarding@resend.dev>`（Resend 测试域）。
- `replyTo` = 提交者邮箱（便于直接回复客户）。
- 发信失败被 `try/catch` 吞掉、仍返回 `success`（不暴露给用户/机器人）→ 排查看服务端日志。

## Resend `from` 规则
`from` 的**域名**只能是 `resend.dev`（测试）或你在 Resend **已验证的域名**；@ 前本地部分随意（无需真实邮箱）。

| `from` | 需要 | 能发给谁 |
|---|---|---|
| `onboarding@resend.dev` | 无 | **仅你 Resend 账号本人邮箱**（测试） |
| `任意@vanyoucargo.com` | 验证主域 + DNS(SPF/DKIM) | 任意收件人 |
| `任意@send.vanyoucargo.com`（**推荐**） | 验证子域 + DNS | 任意收件人 |

❌ 不能用 gmail/qq 等免费邮箱域，或任何未验证/不控制的域。

## 测试 vs 上线
- **现在测**：保持 `onboarding@resend.dev`，`CONTACT_TO_EMAIL` 设成**你 Resend 账号邮箱**（如 `heisundefined@gmail.com`）才收得到（测试域只能发给账号本人）。
- **上线**：在 Resend 验证 `send.vanyoucargo.com`（DNS 加在 Cloudflare）→ `from` 改为 `VANYOU Cargo Solutions Inc. <noreply@send.vanyoucargo.com>`，`CONTACT_TO_EMAIL` 设成 Tony 邮箱 → 可发给任意客户。
- `from` 已改为读 `RESEND_FROM`（未设则回退测试域）。上线设环境变量即可，无需改代码：
  `RESEND_FROM=VANYOU Cargo Solutions Inc. <noreply@vanyoucargo.com>`（Vercel + 本地 `.env.local`）。

---

# Part 3 · Cloudflare 备选（Workers + OpenNext，未实际部署）

> 以下为 Cloudflare 路径完整流程，章节号沿用原手册（0–10）。

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
