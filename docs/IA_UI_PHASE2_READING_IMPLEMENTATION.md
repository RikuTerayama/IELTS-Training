# Phase 2: Reading Hub & CTA Consistency — Implementation Summary

## 1. Changed files list

| File | Change |
|------|--------|
| `app/reading/layout.tsx` | **New.** Metadata (title, description, canonical, OpenGraph) for `/reading`. |
| `app/reading/page.tsx` | **New.** Public Reading hub: hero, question types, how it works, Related (Writing, Speaking, Vocab), FAQ. Primary CTA: Start with Reading vocab; secondary: Log in to dashboard (`next=/home`); tertiary: View pricing. |
| `lib/config/nav.ts` | Added Reading as first item in `PUBLIC_NAV`. |
| `app/page.tsx` | Landing: added Reading to header nav; added Reading to hero skill CTAs (first); added Reading ハブ to 学習リソース section; copy “Reading・Writing・Speaking・語彙”. |
| `app/speaking/page.tsx` | Added Related section (Reading, Writing, Vocab); added “Log in to dashboard” tertiary CTA; aligned step numbers and topic link color to design tokens (`primary`). |
| `app/writing/page.tsx` | Added Related section (Reading, Speaking, Vocab); added “Log in to dashboard” and kept “View pricing”; aligned step numbers, topic links, and internal links to design tokens (`primary`). |

## 2. Reading hub structure

- **Hero:** Title “IELTS Reading Practice”, subtitle about vocabulary and question-type skills, “full passage practice coming next”.  
  **CTAs:** Primary “Start with Reading vocab” → `/vocab?skill=reading`; Secondary “Log in to dashboard” → `/login?next=/home`; Tertiary “View pricing” → `/pricing`.

- **What you can practice:** Six question-type cards (Paraphrase, Matching headings, T/F/NG, Summary completion, Matching information, Sentence completion) with short descriptions. Line under grid: “These question types are available in Reading vocab now. Full passage-based practice is in development.”

- **How it works:** 3 steps: (1) Start with vocab — go to Vocab, choose Reading; (2) Review and repeat — SRS, dashboard when logged in; (3) Full passages — coming next.

- **Related:** Prominent “Vocab → Reading” link plus Writing hub, Speaking hub, Vocab hub.

- **FAQ:** What can I practice now? Is Reading vocab free? How does this fit with Writing and Speaking?

- **Metadata:** Set in `app/reading/layout.tsx` (title, description, canonical `/reading`, OpenGraph).

- **Shell:** `Layout variant="public"` (public header/footer, no progress summary).

## 3. CTA behavior summary

| Hub | Primary CTA | Secondary CTA | Tertiary / other |
|-----|-------------|---------------|------------------|
| **Reading** | “Start with Reading vocab” → `/vocab?skill=reading` (public) | “Log in to dashboard” → `/login?next=/home` | “View pricing” → `/pricing` |
| **Speaking** | “Start interview” → `/exam/speaking` (protected; middleware adds `next`) | “View pricing” → `/pricing` | “Log in to dashboard” → `/login` |
| **Writing** | “Start exam mode” → `/task/select?task_type=Task%202&mode=exam` (protected) | “Start practice” → `/task/select?task_type=Task%202` (protected) | “Log in to dashboard” → `/login`, “View pricing” → `/pricing` |

- **Gated actions:** Links to `/exam/speaking` and `/task/select` are protected. Unauthenticated users are redirected by middleware to `/login?next=<intended path>`, so the return-path flow from Phase 1 preserves destination after login.
- **Reading:** Primary action is public (`/vocab?skill=reading`). “Log in to dashboard” explicitly uses `next=/home` so post-login destination is clear.
- **Consistency:** All hubs have a clear primary (start) and secondary (pricing or second start option); “Log in to dashboard” appears where useful. Design: primary = `buttonPrimary`, secondary = `buttonSecondary`, tertiary = text link `text-primary hover:underline`.

## 4. Placeholder sections intentionally used

- **“Full passage-based practice is in development” / “Full passages — coming next”:** Used so the Reading hub does not promise a full reading exam flow that does not exist yet. No links to non-existent reading passage or exam routes.
- **“Start with Reading vocab”:** Points to existing `/vocab?skill=reading` (public). No dead-end or broken links.
- **Question-type cards:** Informational only; no “Start” per type. Single start path is Vocab → Reading.

## 5. Manual QA checklist

- [ ] **Reading hub**
  - [ ] `/reading` loads with public shell (header: Reading, Writing, Speaking, Vocab, Pricing, Login; logo → `/`; footer without progress).
  - [ ] Hero CTAs: “Start with Reading vocab” goes to `/vocab?skill=reading`; “Log in to dashboard” goes to `/login?next=%2Fhome`; “View pricing” goes to `/pricing`.
  - [ ] Related: “Vocab → Reading”, “Writing hub”, “Speaking hub”, “Vocab” all work.
  - [ ] FAQ and “How it works” step 3 clearly state full passage practice is coming next.
  - [ ] Metadata: tab title and description reflect Reading; OG/canonical if checked.

- [ ] **Public navigation**
  - [ ] Public header (on `/reading`, `/writing`, `/speaking`, `/vocab`, `/pricing`) shows Reading as first nav item, then Writing, Speaking, Vocab, Pricing.
  - [ ] Landing (`/`) header shows Reading, Writing, Speaking, Vocab, Pricing, Contact, Login.
  - [ ] Landing hero “始める” block lists Reading first, then Writing, Speaking, Vocab, Pricing, Login.
  - [ ] Landing “学習リソース” includes “Reading ハブ” and links to `/reading`.

- [ ] **Cross-links**
  - [ ] Speaking hub has “Related” with Reading hub, Writing hub, Vocab; all links work.
  - [ ] Writing hub has “Related” with Reading hub, Speaking hub, Vocab; all links work.
  - [ ] Reading hub “Related” links work.

- [ ] **CTA and return-path**
  - [ ] From Speaking hub, “Start interview” while logged out → redirect to `/login?next=/exam/speaking`; after login, user lands on `/exam/speaking`.
  - [ ] From Writing hub, “Start exam mode” while logged out → redirect to `/login?next=...`; after login, user lands on task select.
  - [ ] From Reading hub, “Log in to dashboard” → `/login?next=/home`; after login, user lands on `/home`.

- [ ] **No regressions**
  - [ ] Writing task flows (`/task/select`, `/task/[taskId]`, etc.) unchanged.
  - [ ] Speaking exam and feedback flows unchanged.
  - [ ] Vocab (`/vocab`, `/vocab?skill=reading`) unchanged.
  - [ ] Mobile: Reading hub and nav are usable and consistent with other hubs.
