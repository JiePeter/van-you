# VANYOU Cargo Solutions Inc. — Next.js Frontend

Next.js 16 (App Router) + Tailwind CSS v4 + daisyUI v5 + next-intl multilingual marketing site for VANYOU Cargo Solutions Inc.

This is a single-page, section-driven site built on a shared architecture (reused across multiple client projects). Sections are defined in Sanity Studio and rendered dynamically; no section component logic should be edited here.

---

## Quick Start

```bash
cd nextjs-vanyou
npm install
npm run dev
```

Open http://localhost:3000/en to view the site.

---

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_PROJECT_ID` | Sanity project ID (TBD — Sanity added later) | Yes |
| `NEXT_PUBLIC_DATASET` | Sanity dataset name (e.g. `production`) | Yes |
| `NEXT_PUBLIC_PROJECT_NAME` | Site/brand name shown in the UI | Yes |
| `NEXT_PUBLIC_PROJECT_DESCRIPTION` | Site description and JSON-LD fallback | Yes |
| `RESEND_API_KEY` | Resend email API key (server-side only) | Yes |
| `CONTACT_TO_EMAIL` | Recipient address for contact-form submissions | Yes |

> `NEXT_PUBLIC_*` variables are exposed to the browser. `RESEND_API_KEY` is server-side only — never commit a real value.

---

## Project Structure

```
src/
├── proxy.ts              # next-intl routing middleware + form-token cookie
├── app/
│   ├── [locale]/         # Multilingual pages (en / zh / zh-Hant / fr)
│   │   ├── page.tsx      # Home (section-driven landing page)
│   │   └── layout.tsx    # Locale layout (Header / Footer / providers)
│   ├── actions/          # Server Actions (submitConsult.ts)
│   └── layout.tsx        # Root layout (metadata)
├── components/
│   ├── sections/         # Section render components (owned by section dev)
│   └── layout/           # Header / Footer / LanguageSwitcher
├── lib/sanity/           # Sanity client, queries, mock data
├── i18n/                 # next-intl configuration
├── messages/             # UI chrome translations (en/zh/zh-Hant/fr)
└── types/                # TypeScript types
```

---

## Vercel Deployment

### Prerequisites

1. **Deploy Sanity Studio** (the Next.js app fetches data from the Sanity API):

   ```bash
   cd studio-vanyou
   pnpm deploy
   ```

2. **Configure Sanity CORS** (https://www.sanity.io/manage → API → CORS Origins):
   - `https://your-project.vercel.app`
   - `https://your-custom-domain.com` (if applicable)
   - `http://localhost:3000` (local development)

### Vercel Project Settings

| Setting | Value |
|---|---|
| Framework Preset | Next.js |
| Root Directory | `nextjs-vanyou` |
| Build Command | `npm run build` |
| Install Command | `npm install` |

> The project lives in a subdirectory — Root Directory must be set in Vercel.

### Deploy Steps

1. Push code to GitHub
2. Go to https://vercel.com/new and import the repository
3. Set Root Directory to `nextjs-vanyou`
4. Add the environment variables listed above
5. Click Deploy

### Post-deploy Checklist

- [ ] `https://your-project.vercel.app/en` loads correctly
- [ ] Language switching works (`/en`, `/zh`, `/fr`)
- [ ] Contact form submits successfully
- [ ] Mobile layout renders correctly
- [ ] No errors in browser console

---

## Common Issues

| Issue | Cause | Fix |
|---|---|---|
| Page shows mock data | Sanity not deployed / CORS not configured / missing env vars | Check CORS allowlist and env vars |
| Build fails | Root Directory not set | Set `nextjs-vanyou` in Vercel settings |
| Form submission fails | `RESEND_API_KEY` invalid | Verify the key at resend.com |
| Images not loading | — | `cdn.sanity.io` is already in `next.config.ts` |
| Env vars not taking effect | Changed after last deploy | Redeploy |

---

## Security Checklist

- [ ] `.env.local` is listed in `.gitignore`
- [ ] `RESEND_API_KEY` is not committed to Git
- [ ] Sanity CORS allowlist contains only necessary origins
