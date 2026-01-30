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

