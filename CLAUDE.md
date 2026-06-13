# VANYOU Cargo Solutions — Project Notes

## Dev server / preview — IMPORTANT
- **Do NOT use the Claude Preview MCP tools** (`preview_start`, `preview_screenshot`, `preview_eval`, etc.) for this project. The in-desktop preview browser fails here due to Google resource access restrictions, and its server management leaves orphaned processes that hold the port.
- The **user opens the page in their own browser** to review visuals.
- To run the app, start it as a plain background process:
  ```bash
  cd nextjs-vanyou && npm run dev
  ```
  It serves on **http://localhost:3000** (or the next free port — check the dev output).
- For verification, prefer **`npx tsc --noEmit`** and **`curl`-ing the served HTML/CSS** (e.g. `curl -s http://localhost:3000/en`) rather than driving a headless browser.
- If a previous dev server is stuck holding the port: find it with `netstat -ano | grep :3000` (or :3005) and `taskkill //PID <pid> //F`.

## Project shape
- Monorepo: `nextjs-vanyou/` (Next.js 16 App Router + Tailwind v4 + daisyUI + next-intl) and `studio-vanyou/` (Sanity Studio).
- Single-page, section-driven landing site for a Vancouver cargo/logistics company.
- Sections (in order): `hero` → `services` → `aboutBio` → `contactBooking`. Rendered via `SectionRenderer.tsx`.
- Locales: `en`, `zh`, `zh-Hant`, `fr` (field-level i18n via `localizedValue`).
- **Runs on mock data** when Sanity env vars are unset — see `src/lib/sanity/mockData.ts` (the source of truth for current content). Sanity is wired but optional.

## Design / brand conventions
- Restrained, sharp-edged B2B aesthetic. Palette: electric blue `#004dff` (primary), cyan `#19bcff` (secondary), navy bases (`#030812`/`#081426`), light "paper" `#f4f7fb` for the Services & Contact sections.
- Zero border-radius (daisyUI theme `vanyou`). No neon/cursor/glow effects (deliberately removed).
- **Kai font (LXGW WenKai)**: used ONLY for Chinese decorative text — About stats (实战/本地/清晰) and the business-card Chinese title — via `.font-kai`, gated to `html[lang^="zh"]`. Latin text never uses kai.
- Texture system: dark sections (Hero, About) use `RouteLines` SVG; white sections (Services, Contact) use the `.blueprint-grid` navy grid.
- Brand assets in `nextjs-vanyou/public/brand/`: `vanyou-log-no-text.png` = **main logo** (header), `vanyou-seal.png` = 文友 trust stamp (About panel + business card only), `vanyou-hero.png` = brand banner image (used as the span-2 supplementary card in Services), plus truck / services-panel / contact-panel references.
- Icons: `lucide-react` (line style), mapped per service in `Services.tsx` `SERVICE_ICONS`.

## Deployment
- Target is **Vercel** (root dir `nextjs-vanyou`); not yet configured. GitHub Pages was removed (static export can't run the middleware/Server Action/ISR).
