# Phase 1: IA/UI Restructuring — Implementation Summary

## 1. Changed files list

| File | Change |
|------|--------|
| `middleware.ts` | Auth boundary: `/speaking` and `/speaking/topics/*` public; `/speaking/feedback/*` and `/exam/*` protected. Return-path: redirect to `/login?next=<path>`. Vocab: `/training/vocab` → `/vocab` (308). |
| `app/(auth)/login/page.tsx` | Read `next` from search params; after successful login redirect to `next` if valid, else onboarding/home. |
| `lib/config/nav.ts` | **New.** Central nav config: `PUBLIC_NAV`, `APP_NAV`. |
| `components/layout/PublicHeader.tsx` | **New.** Public shell header: logo → `/`, nav (Writing, Speaking, Vocab, Pricing), Login. |
| `components/layout/PublicFooter.tsx` | **New.** Public shell footer: no progress API; links to public pages. |
| `components/layout/Layout.tsx` | Added `variant?: 'public' \| 'app'`; renders PublicHeader/PublicFooter or Header/Footer. |
| `components/layout/Header.tsx` | Uses `APP_NAV` from config; design tokens for user/logout; logo → `/home`. |
| `components/vocab/VocabPageContent.tsx` | **New.** Shared vocab UI (moved from `app/training/vocab/page.tsx`); exported for `/vocab` and `/training/vocab`. |
| `app/training/vocab/page.tsx` | Thin wrapper: imports `VocabPageContent` from `@/components/vocab/VocabPageContent`, wraps with `Layout` + Suspense. |
| `app/vocab/page.tsx` | **New.** Canonical public vocab route: `Layout variant="public"` + `VocabPageContent`. |
| `app/speaking/page.tsx` | `Layout` → `Layout variant="public"`. |
| `app/speaking/topics/[slug]/page.tsx` | `Layout` → `Layout variant="public"`. |
| `app/writing/page.tsx` | `Layout` → `Layout variant="public"`. |
| `app/pricing/page.tsx` | `Layout` → `Layout variant="public"`. |
| `app/page.tsx` | Landing: hero auth form removed; hero CTAs = Writing, Speaking, Vocab, Pricing, Login. Header nav: Writing, Speaking, Vocab, Pricing, Contact, Login. Removed auth state/handlers used only by hero form. |

## 2. What changed and why

- **Auth boundary**  
  `/speaking` and `/speaking/topics/[slug]` are public (SEO/marketing).  
  `/exam/speaking`, `/speaking/feedback/[attemptId]`, `/home`, `/task`, `/feedback`, `/progress`, `/rewrite`, `/fillin`, `/pro`, `/admin` remain protected.

- **Return-path (login intent)**  
  Unauthenticated access to a protected path redirects to `/login?next=<encoded path + search>`.  
  Login page reads `next`, validates (same-origin path), and after successful login redirects to `next` when present; otherwise onboarding or `/home`.

- **Public vs app shell**  
  Public pages use `Layout variant="public"`: PublicHeader (logo → `/`, Writing, Speaking, Vocab, Pricing, Login) and PublicFooter (no progress summary).  
  App pages use default `Layout`: Header (logo → `/home`, Home, Progress, Vocab, Blog, user/Login) and Footer (progress summary).  
  Nav is centralized in `lib/config/nav.ts`.

- **Canonical /vocab**  
  `/vocab` is the canonical public vocab route and uses the public shell.  
  Shared content lives in `components/vocab/VocabPageContent.tsx`.  
  Legacy `/training/vocab` redirects (308) to `/vocab` with query preserved.

- **Landing (/) cleanup**  
  `/` is marketing-only: hero auth form removed; main actions are Writing, Speaking, Vocab, Pricing, Login; header includes these + Contact and Login.

## 3. Redirects added or altered

| From | To | Status | Notes |
|------|----|--------|------|
| `/training/vocab` (any query) | `/vocab` (query preserved) | 308 | Legacy → canonical. |
| Protected path (unauthenticated) | `/login?next=<path+search>` | 302 | Return-path. |
| ~~`/vocab`~~ | ~~`/training/vocab`~~ | **Removed** | Previously 308 to training; now `/vocab` is canonical. |

No other redirects were changed (`/training/writing/task2` → `/task/select?task_type=Task%202` etc. unchanged).

## 4. How return-path login works

1. User (not logged in) opens a protected URL (e.g. `/task/select` or `/progress`).
2. Middleware redirects to `/login?next=<encoded path+search>` (e.g. `next=/task/select` or `next=/progress`).
3. User logs in on the login page.
4. Login page:
   - Reads `next` from `searchParams`.
   - Validates: must be a path starting with `/` and not `//` (same-origin).
   - After successful login: if `next` is valid → `window.location.href = next`; else if onboarding incomplete → `/onboarding`; else → `/home`.

So the user is sent back to the page they tried to open after login when `next` is present and valid.

## 5. Intentionally deferred (Phase 2)

- **Route taxonomy / renames**  
  No renames in Phase 1 (e.g. `/home` stays; no large route migration).

- **Reading hub**  
  “Reading” is not yet a dedicated public hub; only Writing, Speaking, Vocab, Pricing are in public nav and landing.

- **Further shell split**  
  No route-group-based layout split (e.g. `(public)` / `(app)`); layout is chosen via `Layout` variant per page.

- **Metadata for /vocab**  
  Canonical/OG can be added in Phase 2 if desired (page is client; metadata would go in a parent layout or a server wrapper).

## 6. Manual QA checklist

- [ ] **Public access**  
  - [ ] `/speaking` and `/speaking/topics/work-study` load without login.  
  - [ ] `/writing`, `/vocab`, `/pricing` load without login.

- [ ] **Protected access**  
  - [ ] `/exam/speaking` and `/speaking/feedback/<id>` require login (redirect to login).  
  - [ ] `/home`, `/task/select`, `/progress` require login.

- [ ] **Return-path**  
  - [ ] Open `/progress` while logged out → redirect to `/login?next=/progress`.  
  - [ ] Log in → redirect to `/progress`.  
  - [ ] Open `/login` with no `next` → after login go to `/home` or `/onboarding` as before.

- [ ] **Shells**  
  - [ ] On `/`, `/speaking`, `/writing`, `/vocab`, `/pricing`: header shows Writing, Speaking, Vocab, Pricing, Login; logo goes to `/`; footer has no “今日の進捗”.  
  - [ ] On `/home`, `/progress`, `/task/select`: header shows Home, Progress, Vocab, Blog, user/Login; logo goes to `/home`; footer shows progress summary.

- [ ] **Canonical /vocab**  
  - [ ] `/vocab` shows vocab content with public shell.  
  - [ ] `/vocab?skill=writing` works.  
  - [ ] Visiting `/training/vocab` redirects (308) to `/vocab` with same query.

- [ ] **Landing**  
  - [ ] `/` has no hero sign-in/sign-up form.  
  - [ ] Hero has CTAs for Writing, Speaking, Vocab, Pricing, Login.  
  - [ ] Header has Writing, Speaking, Vocab, Pricing, Contact, Login.

- [ ] **Existing flows**  
  - [ ] `/task/[taskId]`, `/feedback/[attemptId]`, `/rewrite/[attemptId]`, `/fillin/[attemptId]` still protected and work after login.  
  - [ ] Writing task flows unchanged.
