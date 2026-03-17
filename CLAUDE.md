# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # local dev server (localhost:3000)
npm run build        # production build
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run type-check   # tsc --noEmit
```

No test suite exists. Verify changes with `type-check` and `lint` before committing.

## Branch / Deploy Strategy

- `develop` → Vercel preview (password-protected)
- `main` → production (`myailogs.com`)
- Always push to `develop` first, create PR, user merges to `main`

## Architecture Overview

**Stack:** Next.js 16 App Router · Tailwind v4 · Supabase (Postgres + Auth) · Vercel

### Branding
- User-facing product name: **myAIlogs**
- Copyright brand: **ASHIATO.ai**
- Site URL: `https://myailogs.com` (defined in `SITE_CONFIG` in `src/constants/index.ts`)

### Supabase Clients
Two separate clients — never mix them:
- `src/lib/supabase/server.ts` → `createClient()` — for Server Components and Route Handlers (uses `next/headers` cookies)
- `src/lib/supabase/index.ts` (browser) → `createBrowserClient()` — for Client Components

### Auth
- Google OAuth only (Twitter login removed)
- Auth state lives in `AuthProvider` (`src/components/auth/auth-provider.tsx`)
- Consume via `useAuthContext()` hook — provides `user`, `isAuthenticated`, `openLoginModal()`, `logout()`
- `openLoginModal(message?)` opens the global Google login modal from anywhere
- New users (created within 30s) automatically get the profile setup modal

### Post Form
Two form components exist:
- `SimplePostForm` (`src/components/post/simple-post-form.tsx`) — **active**, used in the hero section, notepad design
- `PostForm` (`src/components/post/post-form.tsx`) — legacy multi-step form, not shown in current UI

Posts can be created without login (`user_id` is nullable). Anonymous posts set `user_id = null` and `is_anonymous = true`. The `is_anonymous` checkbox only shows for authenticated users.

### Slug / URL Design
Slugs are ASCII-only: `{tool}-{result}-{randomId}` (e.g. `chatgpt-solved-x7k2p9ab`).
- Generation: `src/lib/utils/slug.ts`
- Short URL for X sharing: `/p/[id]` → 301 redirect to `/logs/[slug]` (avoids Japanese in share URLs)

### Post List (`PostListSection`)
Client component with `sessionStorage` cache (5-min TTL, key: `ashiato_post_list`).
- Cache stores posts + scroll position for back-navigation restoration
- Cache is cleared on filter/search changes
- `next.config.ts` sets `staleTimes: { dynamic: 0 }` — required to prevent Next.js router cache serving stale post lists on browser back

### CSS / Tailwind v4
Tailwind v4 uses `@import "tailwindcss"` (not `@tailwind` directives).
**Arbitrary hover variants like `hover:[animation-play-state:paused]` do NOT generate CSS in v4.** Put complex/stateful CSS directly in `src/app/globals.css`. All custom keyframe animations (`marquee`, `stamp-drop`, `ink-spread`, `draw-check`, `fade-up`) are defined there.

### Supabase Schema Notes
- `posts.user_id` is nullable (migration v7) — anonymous posting allowed
- RLS INSERT policy: `user_id IS NULL OR auth.uid() = user_id`
- Migration files in `supabase/` are reference only — apply manually via Supabase SQL editor

## Auth Gotchas (from past incidents)

**Never call `signOut()` in error handlers.** During the PKCE OAuth flow, `getSession()` can transiently return an error before the cookie-to-memory sync completes. Calling `signOut()` there will kill a valid in-flight login.

**Skip `updateSession` in middleware for `/auth/callback`.** Running it there consumes the `code_verifier` cookie, causing `exchangeCodeForSession` to fail with `auth_failed`.

**`NEXT_PUBLIC_` env vars are baked in at build time.** Adding/changing them in Vercel requires a redeploy to take effect.

**Always test auth changes in incognito** with a full OAuth login flow from scratch.
