## Swat & Smart 2026 · Event Companion PWA

Production-style mobile-first PWA (Next.js App Router + TypeScript + Tailwind) designed to feel like a native iOS/Android app.

### Features
- **Landing / hero** with event branding + CTAs
- **Registro / login** (simple local profile) + **optional Supabase auth**
- **Home menu** with big primary actions (Agenda / Mapa)
- **Agenda** with category tabs + detail screen + local **favoritos**
- **Mapa** with segmented filter + detail modal
- **Aviso de privacidad**
- **PWA installable** (manifest + service worker + generated icons)

### Local dev
- Install deps:

```bash
npm install
```

- Start dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

### Optional: Supabase (Auth)
This app works without accounts. If you want real auth (for deployment), create a Supabase project and set:

Create `.env.local` (see `ENVIRONMENT.md`):

```bash
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Then:
- `/register` will attempt to `signUp(email, password)`
- `/login` can optionally sign in with password (toggle appears when env vars are present)

### Deploy (Vercel)
- Push to GitHub
- Import project in Vercel
- Add the same Supabase env vars in Vercel Project Settings
- Add `ADMIN_EMAILS` to allow access to `/admin`
- Deploy

### PWA notes
- Manifest is served from `src/app/manifest.ts`
- Icons are generated (no binary files) via `src/app/icon.tsx` and `src/app/apple-icon.tsx`
- Service worker lives at `public/sw.js`

### Supabase config storage (for /admin)
Create a table `app_config` with:
- `id` text primary key
- `config` jsonb not null

Row id used: `default`.

You can set RLS as you prefer; this repo enforces admin access in the API route by checking `ADMIN_EMAILS`.

### Key routes
- `/` landing
- `/login` entrar
- `/register` registrarse
- `/success` registro exitoso
- `/home` menú
- `/agenda` agenda
- `/agenda/[id]` detalle
- `/mapa` mapa
- `/privacidad` aviso

