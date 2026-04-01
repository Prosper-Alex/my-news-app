# 🧪 Hydration Error Fix - Testing Guide

## Quick Test Steps

### 1. Clean Build

```bash
# Remove Next.js cache
rm -rf .next
pnpm clean

# Optional: clear node modules cache
rm -rf node_modules/.cache
```

### 2. Start Dev Server

```bash
pnpm dev
```

### 3. Check Browser Console

Open DevTools (F12 or Cmd+Option+I) and check for errors:

- Navigate to **Console** tab
- Should NOT see any red errors about "hydration mismatch"
- Look for message like: `"Hydration failed because the server rendered text didn't match..."`

### 4. Verify Date Format

Visit http://localhost:3000

**Check articles display date in format:**

```
Mar 31, 2026, 02:00 PM
```

NOT:

```
31 Mar 2026, 14:00  ← This was the bug
```

### 5. Test Multiple Pages

- [ ] Refresh home page - no hydration errors
- [ ] Click on an article - date still correct
- [ ] Go to /saved - dates display correctly
- [ ] Go to /discover - dates display correctly

### 6. Test Across Browsers (Optional)

Force different locales to verify fix:

```javascript
// In browser console
new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
  timeZone: "UTC",
}).format(new Date("2026-03-31T14:00:00Z"));

// Should output: Mar 31, 2026, 02:00 PM
// (Regardless of your system locale/timezone)
```

---

## What Was Fixed

**File Modified:** `lib/news-utils.ts`

**Function:** `formatStoryDate(value?: string | null)`

**Change:**

```diff
- new Intl.DateTimeFormat(undefined, {
+ new Intl.DateTimeFormat("en-US", {
    month: "short",
-   day: "2-digit",
+   day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
+   hour12: true,
+   timeZone: "UTC",
  }).format(date)
```

**Why:**

- `undefined` locale varies by system → inconsistent output
- Fixed to `"en-US"` → consistent across all servers/clients
- Added `timeZone: "UTC"` → consistent time regardless of timezone
- Explicit `hour12: true` → removes ambiguity

---

## Expected Behavior After Fix

| Scenario            | Before                   | After                       |
| ------------------- | ------------------------ | --------------------------- |
| Server renders page | `Mar 31, 2026, 02:00 PM` | ✅ `Mar 31, 2026, 02:00 PM` |
| Client hydrates     | `31 Mar 2026, 14:00`     | ✅ `Mar 31, 2026, 02:00 PM` |
| Browser console     | ❌ Hydration error       | ✅ No errors                |
| Different timezone  | ❌ Different date        | ✅ Same date (UTC)          |

---

## Troubleshooting

### Still seeing hydration errors?

1. **Hard refresh:** Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
2. **Clear cache:** `rm -rf .next && pnpm dev`
3. **Check console:** Look for specific component causing error

### Date still shows wrong format?

1. Make sure `lib/news-utils.ts` is updated
2. Check that featured-news, news-card, saved-page are importing from `lib/news-utils`
3. Restart dev server: `pnpm dev`

### Still inconsistent dates across components?

- `featured-news.tsx` uses `formatStoryDate()` ✅
- `news-card.tsx` uses `formatStoryDate()` ✅
- `saved-page.tsx` uses `formatStoryDate()` ✅
- `[slug]/page.tsx` uses `formatStoryDate()` ✅

All use the same fixed function, so dates should match everywhere.

---

## Verification Checklist

- [ ] No errors in browser console
- [ ] Dates show as `Mar 31, 2026, 02:00 PM`
- [ ] Dates are consistent across page refreshes
- [ ] No "hydration mismatch" warnings
- [ ] Articles display normally on home, saved, discover pages
- [ ] Individual article pages load correctly

---

## Success Indicators

✅ **You fixed it if:**

1. Browser console has NO red errors about hydration
2. Dates display consistently (same format everywhere)
3. Page refreshes don't cause re-rendering/flickering
4. All article components render on first load (no blank articles)

❌ **It's not fixed if:**

1. Still see "Hydration failed..." in console
2. Dates flicker or change on page refresh
3. Articles show blank then populate after load
4. Console shows red errors

---

## Long-term Prevention

Going forward, always remember:

### ✅ Server/Client Consistency Rules

1. Use **explicit locales**, not `undefined`
2. Use **explicit timezones**, not browser default
3. Avoid **variable data** (`Math.random()`, `Date.now()`) in rendered HTML
4. Use `useEffect()` for client-only rendering logic

### ✅ Example Safe Pattern

```typescript
"use client"

export function SafeDateComponent({ isoDate }: { isoDate: string }) {
  // ✅ Safe: uses fixed locale and timezone
  const formatted = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(new Date(isoDate))

  return <span>{formatted}</span>
}
```

---

**Ready to test? Run `pnpm dev` and check the console!** ✅
