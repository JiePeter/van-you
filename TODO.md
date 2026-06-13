# VANYOU — 待办清单 (TD List)

> 上线前 / 上线后的跟进事项。最近更新：2026-06-12

## 待办

### 1. 地图：改为纯图片占位 ✅ 已完成（2026-06-12）
- iframe → `<img>`：[ContactBooking.tsx](nextjs-vanyou/src/components/sections/ContactBooking.tsx) 联系区右栏，去掉 Google Maps 内嵌，改纯图片，无第三方 cookie / 无外链。
- 字段 `mapEmbedUrl` → `mapImageUrl`（[types/sanity.ts](nextjs-vanyou/src/types/sanity.ts) + [mockData.ts](nextjs-vanyou/src/lib/sanity/mockData.ts)）；数据未配时**回退品牌占位图** [vanyou-map-placeholder.svg](nextjs-vanyou/public/brand/vanyou-map-placeholder.svg)，故 Sanity / mock 两种数据源都能显示。
- **后续**：拿到真实地图截图后，放 `public/brand/` 并把 `mapImageUrl` 指过去即可（或直接替换占位 SVG 文件）。Sanity schema 的 contactBooking 字段名待同步（见 #3）。

### 2. 移动端折叠 + 视觉简化 — 已做（2026-06-12，待本地确认）
移动端减负：
- ✅ **视差关闭（移动端）**：[Parallax.tsx](nextjs-vanyou/src/components/motion/Parallax.tsx) 新增 `disableMaxWidth`(默认 767)，窄屏图片静止。
- ✅ **RouteLines 纹理移动端隐藏**：Hero / About 加 `max-md:hidden`。
- ✅ **Hero 信任行折叠**：`trustLine`(大写长串)移动端 `max-md:hidden`。

设计简化（这轮按反馈一起做的）：
- ✅ **Header 可配置简称**：新增 `siteShortName`(默认 VANYOU)，导航/抽屉用简称；长名留给 SEO/页脚。[Header.tsx](nextjs-vanyou/src/components/layout/Header.tsx) / [types/sanity.ts](nextjs-vanyou/src/types/sanity.ts) / [mockData.ts](nextjs-vanyou/src/lib/sanity/mockData.ts)。
- ✅ **Services 卡片改图上叠字**：全部卡统一为「图片满卡 + 底部 scrim + 文本覆盖」。[Services.tsx](nextjs-vanyou/src/components/sections/Services.tsx)。
- ✅ **About 滚动滑入叠图**：卡车图作底，文字面板随滚动从左滑入覆盖；移动端/reduce-motion 静止。[AboutBio.tsx](nextjs-vanyou/src/components/sections/AboutBio.tsx)。
- ✅ **About stats 整组移除**(实战/本地/清晰 + 标签)：组件不再渲染（mockData/Sanity 仍留数据，不可见）。
- ✅ **联系表单改浅卡**：根因是深卡 + light 主题 token 不匹配 → 改白底柔卡、输入框柔和 paper、label 改 slate、focus 改品牌蓝。[globals.css](nextjs-vanyou/src/app/globals.css) / [ContactBooking.tsx](nextjs-vanyou/src/components/sections/ContactBooking.tsx)。
- ✅ **Hero 移动端**(按必要性评估，4 改 1 否)：#2 移动端弱化遮罩(后又按反馈**还原**)、#3 内容上抬(`pb-24`)、#1 主标题 `text-balance`、#4 次 CTA 减权(ghost+淡边)。**#5 navbar×hero 统一明确不做**。[Hero.tsx](nextjs-vanyou/src/components/sections/Hero.tsx)。

二轮微调（2026-06-12）：
- ✅ **Hero 遮罩还原**：移动端弱化遮罩按反馈回退为原双层（其它 hero 改动保留）。
- ✅ **Services 图标简化**：蓝底白图标方块 → 裸线性图标(青色)。[Services.tsx](nextjs-vanyou/src/components/sections/Services.tsx)。
- ✅ **Services 补足图移动端收高**：side 卡 `aspect-video`(16:9) / 桌面 `min-h-240`，`object-cover` 不变形。
- ✅ **About 移动端图撑满**：去 section 内外边距 + 容器约束 + 边框(`max-md`)，桌面不变。[AboutBio.tsx](nextjs-vanyou/src/components/sections/AboutBio.tsx)。
- ✅ **发送按钮略带圆角**：`rounded-md`。[ContactBooking.tsx](nextjs-vanyou/src/components/sections/ContactBooking.tsx)。
- ✅ **隐私政策 / 使用条款**：内联 `modalBody`(4 语言、规范简短)，footer 点击弹 daisyUI dialog([FooterModalLink.tsx](nextjs-vanyou/src/components/layout/FooterModalLink.tsx))；已同步 Sanity。
- **验收**：窄屏(~375px)查首屏/服务/关于/联系；桌面查 About 滚动滑入；点 footer 隐私/条款看弹窗。

### 3. Sanity 正式上线预布置 —— 大部分已完成（2026-06-12）
- ✅ 新建 VANYOU 专属项目 `swlg6klq`（org `oav291Y1M`，免费版）。
- ✅ projectId 写入两处：`studio-vanyou/.env` + `nextjs-vanyou/.env.local`（均 `swlg6klq`，dataset `production`）。
- ✅ 导出并导入种子：3 个文档（siteSettings / navigation / landingPage）已进 `production`；Next 重启后确认从 Sanity 取数、渲染 VANYOU 内容（非 mock 兜底）。
- ✅ 清理导出脚本 [export-mock-ndjson.ts](nextjs-vanyou/scripts/export-mock-ndjson.ts) 的 fitboss 残留与输出路径。
- ✅ **schema 字段补齐并同步**：`siteShortName`(siteSettings)、`mapImageUrl`(contactBooking，原 mapEmbedUrl)、`modalBody`(link，隐私/条款内联正文) 均已加 Studio schema 且数据已重导入 Sanity。隐私/条款改用**内联 modalBody**（不走 modalContent 引用，mock/Sanity 同形、自动同步）。
- ✅ **Studio 已部署**：[vanyoucargo.sanity.studio](https://vanyoucargo.sanity.studio/)（`studioHost: 'vanyoucargo'` + `appId: 'xwowlcyvn63c4t5c3ztkvc76'` 已写入 [sanity.cli.ts](studio-vanyou/sanity.cli.ts)，下次 `sanity deploy` 免交互）。Tony 需用受邀账号登录后编辑。
- ☐ **待办：邀请 Tony 进 Sanity 项目**（[sanity.io/manage](https://www.sanity.io/manage) → 项目成员 → Invite），否则他无法登录后台编辑。
- ☐ CORS：当前 Next 为服务端取数（无 token、读 public dataset），**无需配 CORS**；仅当将来加客户端实时预览才需要。

---

## 其它已知上线项（详见上线报告，非本次新增）
- 邮件仍是 Resend 沙盒 `onboarding@resend.dev` + `RESEND_API_KEY` 为空 → 需验证发信域、填 key。
- 邮件发送失败被静默吞掉，仍返回 success（[submitConsult.ts:154](nextjs-vanyou/src/app/actions/submitConsult.ts)）。
- 未设 `metadataBase`；缺 `robots.ts` / `sitemap.ts` / OG 图 / manifest。
- 未配置 Vercel 部署。
