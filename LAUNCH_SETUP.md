# Prompt Library Launch Setup

Complete these steps only after the `codex/launch-ready-mvp` branch is available on GitHub.

## 1. Make a lightweight content backup

In Supabase Table Editor, open `prompts` and export the table as CSV. The migration is additive and transactional, but the export gives the Free Plan project a manual content checkpoint.

## 2. Run the database migration

1. Open Supabase → SQL Editor → New query.
2. Copy the complete contents of `supabase_rls.sql`.
3. Confirm the two bootstrap administrator UUIDs are correct.
4. Run the query once.
5. Confirm the query completes without an error.

The script creates contributor profiles, prompt review fields, helper functions, indexes, and strict database/storage policies. Existing prompts are preserved and marked `published`.

Do not upload new prompts from the old admin page between this migration and the new deployment. The old page does not send the new publication status.

## 3. Verify Supabase

- Table Editor contains `profiles`.
- `prompts` contains `status`, `prompt_type`, `style`, `image_path`, `featured`, and the other new metadata columns.
- The two existing administrators have role `admin` in `profiles`.
- Storage bucket `prompt-images` remains public and accepts JPG, PNG, and WebP files up to 5 MB.

## 4. Configure Auth URLs

In Supabase → Authentication → URL Configuration:

- Site URL: `https://prompt-library-vert.vercel.app`
- Add redirect URL: `https://prompt-library-vert.vercel.app/update-password`
- Add the equivalent Vercel preview URL only while testing the branch.

Keep email confirmation enabled for contributor registrations.

## 5. Vercel environment variables

Keep all existing Supabase, Upstash, Sentry, and PostHog values. Add or verify these names:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `SENTRY_AUTH_TOKEN`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`
- `NEXT_PUBLIC_SITE_URL=https://prompt-library-vert.vercel.app`
- `NEXT_PUBLIC_CONTACT_EMAIL` (the real public support/removal email)

`NEXT_PUBLIC_ADMIN_UUID` is no longer used by the new application. Database roles and RLS are the authority.

## 6. Preview acceptance test

1. Open the preview in a signed-out/private browser and confirm browsing, search, filters, Copy, Open, favourites, and history.
2. Open `/contribute`, create one test contributor, and confirm the account starts in `viewer` status.
3. Sign in through `/login` with an administrator account.
4. Approve the contributor in `/admin`.
5. Submit a prompt as the contributor.
6. Approve it as an administrator and confirm it appears publicly.
7. Test edit, feature, reject, and delete actions.
8. Check mobile layout and Supabase Usage.

Merge to `main` only after this checklist passes.
