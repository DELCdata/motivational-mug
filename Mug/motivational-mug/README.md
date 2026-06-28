# Motivational Mug POS · Supabase Edition

Coffee ministry POS for Duncansville Evangelical Lutheran Church — now with real-time cross-device sync via Supabase, hosted on GitHub Pages.

---

## Setup

### 1. Supabase
- Run `schema.sql` in your Supabase project's **SQL Editor** (available in the `motivational-mug-schema/` companion folder)
- Your project URL and anon key are already wired in `src/supabase.js`

### 2. GitHub repo
Create a repo under the **DELCdata** org named `motivational-mug`.

```bash
git init
git remote add origin https://github.com/DELCdata/motivational-mug.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

### 3. Enable GitHub Pages
In the repo settings → **Pages** → Source: **GitHub Actions**

The first push triggers the deploy workflow automatically. Your app will be live at:
```
https://delcdata.github.io/motivational-mug/
```

---

## Local development

```bash
npm install
npm run dev
```

---

## How it works

| Data | Supabase table | Notes |
|------|---------------|-------|
| Menu (categories + items) | `menu` | Single JSONB row — the entire menu object |
| Orders | `orders` | One row per completed order |
| Next order number | `settings` | Key `next_order_num` |

All three tables use public RLS policies (no auth required — the POS runs on a trusted church device). Tighten to `authenticated` role if you add login later.

---

## Vite config
`vite.config.js` sets `base: '/motivational-mug/'` to match the GitHub Pages sub-path. If you rename the repo, update this value and re-deploy.
