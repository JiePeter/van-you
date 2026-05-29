# VANYOU Cargo Solutions Inc. — Sanity Studio

Sanity Studio v3，section-based page builder 内容管理。

---

## Quick Start

```bash
cd studio-vanyou
pnpm install
pnpm dev
```

打开 http://localhost:3333 进入 Studio。

### 部署到生产

```bash
pnpm deploy
```

部署后配置 CORS（见 `nextjs-vanyou/README.md`）。

---

## Schema 结构

```
schemaTypes/
├── documents/        # 7 个文档类型
│   ├── siteSettings  # 站点全局设置（singleton）
│   ├── navigation    # 导航配置（singleton）
│   ├── homePage      # 首页（singleton）
│   ├── servicePage   # 服务页（singleton）
│   ├── aboutPage     # 关于页（singleton）
│   ├── contactPage   # 联系页（singleton）
│   └── quoteRequest  # 表单提交记录
├── objects/          # 基础对象类型
│   ├── localizedString / localizedText / localizedRichText / localizedImage
│   ├── link / portableText / seo
│   └── menuItem / menuGroup
└── sections/         # 11 个 section 类型
    ├── heroCarousel / heroSimple
    ├── promoMediaSplit / featureCards / servicesGrid
    ├── satisfactionBlock / ctaBannerFull / testimonialsCarousel
    ├── richTextSection
    └── contactFormBlock / contactInfoBlock
```

> 完整字段规格见根目录 `project-overview.md`。

---

## 测试数据创建

参照 `nextjs-vanyou/src/lib/sanity/mockData.ts`，该文件包含所有 6 种文档类型的完整三语示例数据，可直接作为 Studio 录入的范本。

录入顺序：Site Settings → Navigation → Home Page → Service Page → About Page → Contact Page

- localized 字段至少填 `en`，`zh` / `fr` 选填（前端 fallback 到 en）
- 图片可暂时留空（前端使用渐变色占位）

---

## 浏览器验证清单

启动前端 `cd nextjs-vanyou && npm run dev` 后检查：

- [ ] `http://localhost:3000/en` — 首页 sections 全部渲染
- [ ] `http://localhost:3000/zh` — 中文内容 / 回退正常
- [ ] `http://localhost:3000/fr` — 法文内容 / 回退正常
- [ ] `/en/services`、`/en/about`、`/en/contact` — 各页面正常
- [ ] 移动端 (375px)：汉堡菜单、布局无溢出
- [ ] LanguageSwitcher 切换语言后保持当前页面
- [ ] 浏览器 Console 无红色错误
