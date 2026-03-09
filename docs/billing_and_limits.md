# Billing And Limits (Pre-Payment Operation)

This document defines how to operate Free limits and temporary Pro access before payment integration is available.

## Free Limits (Default)

- Writing AI: `10 / day`
- Speaking AI: `5 / day`
- Minimum interval between LLM calls: `2 seconds`
- Day boundary: JST (`Asia/Tokyo`)

## Counted API Routes

Only calls that actually enter an LLM branch are counted.

### Writing scope

- `POST /api/tasks/generate`
  - Task 1: counted only when `generateTask1VocabOnly(...)` is called
  - Task 2: counted only when `generateTask(...)` is called
- `POST /api/llm/prep-evaluation`
- `POST /api/llm/prep-to-essay`
- `POST /api/llm/feedback`
  - Not counted when existing feedback is reused
  - Counted only for new feedback generation
- `POST /api/tasks/[taskId]/rewrite`
- `POST /api/task1/review/steps`
- `POST /api/task1/review/final`

### Speaking scope

- `POST /api/speaking/prompts/generate`
  - Not counted when preset prompt path is used
  - Counted only when LLM generation path is used
- `POST /api/speaking/evaluations`

## 429 Response Behavior

When limit or minimum interval is exceeded, APIs return HTTP `429` with `ApiResponse` shape:

```json
{
  "ok": false,
  "error": {
    "code": "RATE_LIMIT",
    "message": "Daily limit reached",
    "details": {
      "scope": "writing",
      "limit": 10,
      "remaining": 0,
      "upgrade_url": "/#pricing",
      "reason": "DAILY_LIMIT"
    }
  }
}
```

`reason` is currently:

- `DAILY_LIMIT`
- `TOO_FAST`

## Environment Variables

- `FREE_DAILY_WRITING_LIMIT`
- `FREE_DAILY_SPEAKING_LIMIT`
- `LLM_MIN_INTERVAL_SECONDS`
- `UPGRADE_URL` (current default/fallback: `/#pricing`)
- `PRO_USER_IDS` (comma-separated Supabase user IDs)

## Temporary Pro Grant Flow (Before Payment)

Use `PRO_USER_IDS` to bypass usage counting for specific users.

### Grant Pro

1. Get target user `id` from Supabase Auth / `profiles`.
2. Add the ID to `PRO_USER_IDS` (comma-separated).
3. Save env vars and redeploy (or apply env update in hosting platform).
4. Verify target user can continue beyond Free daily limits.

### Revoke Pro

1. Remove the user ID from `PRO_USER_IDS`.
2. Save env vars and redeploy.
3. Verify limits apply again for that user.

## Pro Request Entry (Current)

- Current request entry is LP contact section (`/#contact`, Google Form).
- Pricing anchor is `/#pricing` and used by upgrade CTA fallback.

## Migration Apply Memo

Before enabling this in production DB, apply:

- `supabase/migrations/008_usage_limits.sql`

This migration includes:

- `public.user_usage_daily` table
- RLS + policies
- `public.consume_usage(...)` RPC (atomic check + increment)
