# Prompt Library

A free-tier-first library for discovering, copying, and reusing curated AI image and video prompts.

## Launch MVP

- Public browsing without an account
- Model, style, media-type, search, Featured, and Newest filters
- Local favourites and viewing history
- Copy prompt and open the relevant external AI tool
- Invite-and-approve contributor workflow
- Administrator review, publishing, editing, featuring, and removal
- Browser-side WebP image compression before Supabase Storage uploads
- Supabase RLS as the authorization boundary

## Local development

1. Copy `.env.example` to `.env.local` and provide your own development values.
2. Install dependencies with `npm ci`.
3. Run `npm run dev`.

Quality checks:

```bash
npm run lint
npm run build
npm audit --omit=dev
```

Never commit `.env` files, service-role keys, Sentry authentication tokens, or Upstash tokens.

## Deployment

Read `LAUNCH_SETUP.md` before applying `supabase_rls.sql` or merging launch changes into `main`.
