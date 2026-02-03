## Environment variables (Production)

Set these in your hosting provider (e.g. Vercel):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)

Password wall (server-only):

- `APP_COOKIE_SECRET` (random secret for signing the access cookie)
- `APP_USER_PASS`
- `APP_ADMIN_PASS`
- `APP_ADMIN_PASS_ALT` (optional)

## Environment variables (local + Vercel)

Create a local `.env.local` (not committed) with:

```bash
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

# Comma-separated admin emails allowed to access /admin
ADMIN_EMAILS=admin1@company.com,admin2@company.com
```

### Important
- Use **ONLY** the **anon/publishable** key in `NEXT_PUBLIC_*`.
- **Never** put the **secret/service role** key in any `NEXT_PUBLIC_*` variable or client-side code.

